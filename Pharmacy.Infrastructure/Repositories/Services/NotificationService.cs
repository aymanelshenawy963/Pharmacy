using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Pharmacy.Core.Entities;
using Pharmacy.Core.Entities.Enums;
using Pharmacy.Core.interfaces;
using Pharmacy.Core.Interfaces.Services;
using Pharmacy.Core.Settings;

namespace Pharmacy.Infrastructure.Repositories.Services;

public class NotificationService(
    IUnitOfWork unitOfWork,
    IEmailSender emailSender,
    UserManager<User> userManager,
    ILogger<NotificationService> logger) : INotificationService
{
    private const int LowStockThreshold = 3;

    public async Task MonitorStockAsync()
    {
        var products = await unitOfWork.ProductRepository.GetAllAsync();

        foreach (var product in products)
        {
            if (product.Stock <= LowStockThreshold)
                await HandleLowStockAsync(product);
            else
                await HandleRecoveredStockAsync(product);
        }

        await unitOfWork.SaveAsync();
    }

    private async Task HandleLowStockAsync(Product product)
    {
        var existing = await unitOfWork.NotificationRepository
            .GetActiveNotificationForProductAsync(product.Id);

        if (existing is not null)
            return; // already notified — do nothing

        var notification = new Notification
        {
            ProductId = product.Id,
            ProductName = product.Name,
            StockAtCreation = product.Stock,
            Status = NotificationStatus.Active,
            Message = $"Low stock alert: '{product.Name}' has only {product.Stock} unit(s) remaining."
        };

        await unitOfWork.NotificationRepository.AddAsync(notification);

        logger.LogWarning("Low stock notification created for product '{Name}' (Id={Id}, Stock={Stock})",
            product.Name, product.Id, product.Stock);

        await TrySendEmailAsync(notification);
    }

    private async Task HandleRecoveredStockAsync(Product product)
    {
        var existing = await unitOfWork.NotificationRepository
            .GetActiveNotificationForProductAsync(product.Id);

        if (existing is null)
            return; // nothing to resolve

        existing.Status = NotificationStatus.Resolved;
        existing.ResolvedAt = DateTime.UtcNow;

        unitOfWork.NotificationRepository.Update(existing);

        logger.LogInformation("Notification resolved for product '{Name}' (Id={Id}) — stock recovered to {Stock}",
            product.Name, product.Id, product.Stock);
    }

    private async Task TrySendEmailAsync(Notification notification)
    {
        try
        {
            var admins = await userManager.GetUsersInRoleAsync("Admin");

            if (!admins.Any())
            {
                logger.LogWarning("No admin users found to notify for product '{Name}'", notification.ProductName);
                return;
            }

            var subject = $"[Low Stock Alert] {notification.ProductName}";
            var body = BuildEmailBody(notification);

            foreach (var admin in admins)
            {
                if (!string.IsNullOrEmpty(admin.Email))
                    await emailSender.SendEmailAsync(admin.Email, subject, body);
            }
        }
        catch (Exception ex)
        {
            // Email failure must never abort the monitoring job
            logger.LogError(ex, "Failed to send low-stock email for product '{Name}'", notification.ProductName);
        }
    }

    private static string BuildEmailBody(Notification notification) => $"""
        <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #d9534f;">⚠ Low Stock Alert</h2>
            <p>The following product is running low on stock:</p>
            <table style="border-collapse: collapse; width: 100%;">
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Product</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">{notification.ProductName}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Current Stock</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd; color: #d9534f;">{notification.StockAtCreation} unit(s)</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Alert Time</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">{notification.CreatedAt:f} UTC</td>
                </tr>
            </table>
            <p style="margin-top: 16px;">Please restock this product as soon as possible.</p>
        </body>
        </html>
        """;

    public Task<IReadOnlyList<Notification>> GetNotificationsAsync(NotificationStatus? status = null)
        => unitOfWork.NotificationRepository.GetAllAsync(status);

    public Task<int> GetUnreadCountAsync()
        => unitOfWork.NotificationRepository.GetUnreadCountAsync();

    public async Task<bool> MarkAsReadAsync(int notificationId)
    {
        var notification = await unitOfWork.NotificationRepository.GetByIdAsync(notificationId);

        if (notification is null)
            return false;

        if (notification.Status == NotificationStatus.Active)
            notification.Status = NotificationStatus.Read;

        unitOfWork.NotificationRepository.Update(notification);
        await unitOfWork.SaveAsync();
        return true;
    }
}
