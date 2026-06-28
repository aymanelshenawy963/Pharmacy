using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Pharmacy.Core.DTO;
using Pharmacy.Core.Entities;
using Pharmacy.Core.Entities.Enums;
using Pharmacy.Core.interfaces;
using Pharmacy.Core.Interfaces.Services;
using Pharmacy.Infrastructure.Data;

namespace Pharmacy.Infrastructure.Repositories.Services;

public class OrderService(IUnitOfWork unitOfWork, IMapper mapper, AppDbContext context) : IOrderService
{
    private readonly IUnitOfWork _unitOfWork = unitOfWork;
    private readonly IMapper _mapper = mapper;
    private readonly AppDbContext _context = context;

    public async Task<(OrderToReturnDTO? Order, string? Error)> CreateOrderAsync(
        string buyerEmail, CreateOrderDTO dto)
    {
        // 1. Retrieve the basket from Redis
        var basket = await _unitOfWork.BasketRepository.GetBasketAsync(dto.BasketId);
        if (basket is null || basket.Items.Count == 0)
            return (null, "Basket is empty or not found");

        // 2. Validate the delivery method exists in the database
        var deliveryMethod = await _context.DeliveryMethods.FindAsync(dto.DeliveryMethodId);
        if (deliveryMethod is null)
            return (null, "Delivery method not found");

        // 3. Build OrderItems — prices sourced from DB only, never from the basket payload
        var orderItems = new List<OrderItem>();

        foreach (var basketItem in basket.Items)
        {
            var product = await _context.Products
                .Include(p => p.Photos)
                .FirstOrDefaultAsync(p => p.Id == basketItem.ProductId);

            if (product is null)
                return (null, $"Product with ID {basketItem.ProductId} was not found");

            if (product.Stock < basketItem.Quantity)
                return (null,
                    $"Insufficient stock for '{product.Name}'. " +
                    $"Requested: {basketItem.Quantity}, Available: {product.Stock}");

            var mainImage = product.Photos.FirstOrDefault()?.ImageName ?? string.Empty;

            orderItems.Add(new OrderItem(
                product.Id,
                mainImage,
                product.Name,
                product.NewPrice,   // authoritative price from DB
                basketItem.Quantity
            ));

            // 4. Reduce stock — EF tracks this automatically (entity is not AsNoTracking)
            product.Stock -= basketItem.Quantity;
        }

        // 5. Map the shipping address value object
        var shippingAddress = _mapper.Map<ShippingAddress>(dto.ShippingAddress);

        // 6. Calculate subtotal from the verified DB prices
        var subTotal = orderItems.Sum(i => i.Price * i.Quantity);

        // 7. Build the Order entity
        var order = new Order(
            buyerEmail,
            subTotal,
            shippingAddress,
            deliveryMethod,
            orderItems,
            basket.PaymentIntentId ?? string.Empty
        );

        // 8. Stage the order (no DB write yet)
        await _unitOfWork.OrderRepository.AddAsync(order);

        // 9. Single atomic commit — order insert + all stock decrements in one transaction
        var rowsAffected = await _unitOfWork.SaveAsync();
        if (rowsAffected <= 0)
            return (null, "Failed to save the order. Please try again");

        // 10. Delete the basket from Redis — best-effort; the order is already persisted
        await _unitOfWork.BasketRepository.DeleteBasketAsync(dto.BasketId);

        // 11. Re-query to populate navigation properties needed by the mapper
        var createdOrder = await _unitOfWork.OrderRepository.GetOrderByIdAsync(order.Id, buyerEmail);
        return (_mapper.Map<OrderToReturnDTO>(createdOrder), null);
    }

    public async Task<IReadOnlyList<OrderToReturnDTO>> GetOrdersForUserAsync(string buyerEmail)
    {
        var orders = await _unitOfWork.OrderRepository.GetOrdersForUserAsync(buyerEmail);
        return _mapper.Map<IReadOnlyList<OrderToReturnDTO>>(orders);
    }

    public async Task<OrderToReturnDTO?> GetOrderByIdAsync(int id, string buyerEmail)
    {
        var order = await _unitOfWork.OrderRepository.GetOrderByIdAsync(id, buyerEmail);
        return order is null ? null : _mapper.Map<OrderToReturnDTO>(order);
    }

    public async Task<IReadOnlyList<OrderToReturnDTO>> GetAllOrdersAsync()
    {
        var orders = await _context.Orders
            .Include(o => o.DeliveryMethod)
            .Include(o => o.OrderItems)
            .OrderByDescending(o => o.OrderDate)
            .AsNoTracking()
            .ToListAsync();

        return _mapper.Map<IReadOnlyList<OrderToReturnDTO>>(orders);
    }

    public async Task<(bool IsSuccess, string? Error)> UpdateOrderStatusAsync(int id, OrderStatus status)
    {
        var order = await _context.Orders.FindAsync(id);
        if (order is null)
            return (false, $"Order {id} not found");

        if (order.Status == OrderStatus.Cancelled)
            return (false, "Cannot update a cancelled order");

        if (order.Status == status)
            return (false, $"Order is already in '{status}' status");

        order.Status = status;
        await _unitOfWork.SaveAsync();

        return (true, null);
    }

    public async Task<(bool IsSuccess, string? Error)> CancelOrderAsync(int id, string buyerEmail)
    {
        var order = await _context.Orders
            .Include(o => o.OrderItems)
            .FirstOrDefaultAsync(o => o.Id == id && o.BuyerEmail == buyerEmail);

        if (order is null)
            return (false, "Order not found");

        if (order.Status == OrderStatus.Cancelled)
            return (false, "Order is already cancelled");

        if (order.Status is OrderStatus.Shipped or OrderStatus.Delivered)
            return (false, $"Cannot cancel an order that has already been {order.Status}");

        // Restore stock for every item in the cancelled order
        foreach (var item in order.OrderItems)
        {
            var product = await _context.Products.FindAsync(item.ProductId);
            if (product is not null)
                product.Stock += item.Quantity;
        }

        order.Status = OrderStatus.Cancelled;

        // Single commit — status change + all stock restorations in one transaction
        await _unitOfWork.SaveAsync();

        return (true, null);
    }
}
