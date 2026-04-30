using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Pharmacy.API.Controllers;
using Pharmacy.API.Helpers;
using Pharmacy.Core.interfaces;

public class BasketsController : BaseController
{
    public BasketsController(IUnitOfWork unitOfWork, IMapper mapper)
        : base(unitOfWork, mapper)
    {
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Basket>> GetBasketById(string id)
    {
        //if (string.IsNullOrWhiteSpace(id))
        //    return BadRequest(new ResponseAPI(400, "Invalid basket id"));

        var basket = await _unitOfWork.BasketRepository.GetBasketAsync(id);

        return basket is null
            ? Ok(new Basket())
            : Ok(basket);
    }

    [HttpPost]
    public async Task<ActionResult<Basket>> AddOrUpdateBasket([FromBody] Basket basket)
    {
        if (basket == null)
            return BadRequest(new ResponseAPI(400, "Basket is required"));

        var updatedBasket = await _unitOfWork.BasketRepository.UpdateBasketAsync(basket);

        return updatedBasket is null
            ? BadRequest(new ResponseAPI(400))
            : Ok(updatedBasket);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBasket(string id)
    {
        if (string.IsNullOrWhiteSpace(id))
            return BadRequest(new ResponseAPI(400, "Invalid basket id"));

        var result = await _unitOfWork.BasketRepository.DeleteBasketAsync(id);

        return result
            ? Ok(new ResponseAPI(200, "Basket deleted"))
            : NotFound(new ResponseAPI(404));
    }
}