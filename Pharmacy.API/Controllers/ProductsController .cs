using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
        var product = await _unitOfWork.ProductRepository.GetByIdAsync(id);
        if (product == null)
            return NotFound();
        var productDto = _mapper.Map<ProductToReturnDTO>(product);
        return Ok(productDto);
    }

    [HttpPost]
    public async Task<IActionResult> Create(ProductDTO productDto)
    {
        var product = _mapper.Map<Product>(productDto);
        await _unitOfWork.ProductRepository.AddAsync(product);
        var productToReturn = _mapper.Map<ProductToReturnDTO>(product);
        return CreatedAtAction(nameof(GetById), new { id = product.Id }, productToReturn);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, ProductDTO productDto)
    {
        var product = await _unitOfWork.ProductRepository.GetByIdAsync(id);
        if (product == null)
            return NotFound();
        _mapper.Map(productDto, product);
        await _unitOfWork.ProductRepository.UpdateAsync(product);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var product = await _unitOfWork.ProductRepository.GetByIdAsync(id);
        if (product == null)
            return NotFound();
        await _unitOfWork.ProductRepository.DeleteAsync(id);
        return NoContent();
    }

}
