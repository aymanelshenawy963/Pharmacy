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

        return Ok(new ResponseAPI(200, data: productsDto));

    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var product = await _unitOfWork.ProductRepository
            .GetByIdAsync(id, p => p.Category, p => p.Photos);

        if (product == null)
            return NotFound(new ResponseAPI(404));

        var productDto = _mapper.Map<ProductToReturnDTO>(product);

        return Ok(new ResponseAPI(200, data: productDto));

    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ProductDTO productDto)
    {
        var product = _mapper.Map<Product>(productDto);
        await _unitOfWork.ProductRepository.AddAsync(product);

        var productWithIncludes = await _unitOfWork.ProductRepository
            .GetByIdAsync(product.Id, p => p.Category, p => p.Photos);

        var productToReturn = _mapper.Map<ProductToReturnDTO>(productWithIncludes);
        return CreatedAtAction(nameof(GetById), new { id = product.Id }, new ResponseAPI(201, data: productToReturn));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update([FromRoute] int id, [FromBody] ProductDTO productDto)
    {
        var product = await _unitOfWork.ProductRepository.GetByIdAsync(id);

        if (product == null)
            return NotFound(new ResponseAPI(404));

        _mapper.Map(productDto, product);

        await _unitOfWork.ProductRepository.UpdateAsync(product);

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var product = await _unitOfWork.ProductRepository.GetByIdAsync(id);

        if (product == null)
            return NotFound(new ResponseAPI(404));

        await _unitOfWork.ProductRepository.DeleteAsync(id);

        return NoContent();
    }

}
