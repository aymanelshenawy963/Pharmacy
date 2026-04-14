using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Pharmacy.Core.DTO;
using Pharmacy.Core.Entities;
using Pharmacy.Core.interfaces;

namespace Pharmacy.API.Controllers;

public class CategoriesController : BaseController
{
    public CategoriesController(IUnitOfWork unitOfWork, IMapper mapper) : base(unitOfWork, mapper)
    {
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var categories = await _unitOfWork.CategoryRepository.GetAllAsync();

        if (categories == null || !categories.Any())
            return NotFound("No categories found");

     var result = _mapper.Map<IReadOnlyList<CategoryToReturnDTO>>(categories);
       return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var category = await _unitOfWork.CategoryRepository.GetByIdAsync(id);
        if (category == null)
            return NotFound($"Category with ID {id} not found");
        var result = _mapper.Map<CategoryToReturnDTO>(category);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CategoryDTO categoryDto)
    {
        if (categoryDto == null)
            return BadRequest("Category data is required");
        var newCategory = _mapper.Map<Category>(categoryDto);
        await _unitOfWork.CategoryRepository.AddAsync(newCategory);
        var result = _mapper.Map<CategoryToReturnDTO>(newCategory);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update([FromRoute] int id, [FromBody] CategoryDTO categoryDto)
    {
        if (categoryDto == null)
            return BadRequest("Category data is required");
        var existingCategory = await _unitOfWork.CategoryRepository.GetByIdAsync(id);
        if (existingCategory == null)
            return NotFound($"Category with ID {id} not found");
        _mapper.Map(categoryDto, existingCategory);
        await _unitOfWork.CategoryRepository.UpdateAsync(existingCategory);
        return NoContent();

    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var existingCategory = await _unitOfWork.CategoryRepository.GetByIdAsync(id);
        if (existingCategory == null)
            return NotFound($"Category with ID {id} not found");
        await _unitOfWork.CategoryRepository.DeleteAsync(id);
        return NoContent();
    }
}
