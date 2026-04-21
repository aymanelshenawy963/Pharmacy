using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Pharmacy.API.Helpers;
using Pharmacy.Core.DTO;
using Pharmacy.Core.Entities;
using Pharmacy.Core.interfaces;

namespace Pharmacy.API.Controllers;


public class ProductsController : BaseController
{
    public ProductsController(IUnitOfWork unitOfWork, IMapper mapper) : base(unitOfWork, mapper)
    {
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var products = await _unitOfWork.ProductRepository
          .GetAllAsync(p => p.Category, p => p.Photos);

        var productsDto = _mapper.Map<List<ProductToReturnDTO>>(products);

        return Ok(productsDto);

    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var product = await _unitOfWork.ProductRepository
            .GetByIdAsync(id, p => p.Category, p => p.Photos);

        if (product == null)
            return NotFound(new ResponseAPI(404));

        var productDto = _mapper.Map<ProductToReturnDTO>(product);

        return Ok(productDto);

    }

    [HttpPost]
    public async Task<IActionResult> Create([FromForm] ProductDTO productDto)
    {
        var result = await _unitOfWork.ProductRepository.AddAsync(productDto);

        return CreatedAtAction(
            nameof(GetById),
            new { id = result.Id },
            result
        );
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update([FromRoute] int id, [FromForm] ProductDTO productDto)
    {
        var result = await _unitOfWork.ProductRepository.UpdateAsync(id, productDto);

        if (!result)
            return NotFound(new ResponseAPI(404));

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var product = await _unitOfWork.ProductRepository.GetByIdAsync(id);

        if (product == null)
            return NotFound(new ResponseAPI(404));

        await _unitOfWork.ProductRepository.DeleteAsync(product);

        return NoContent();
    }

}
