using AutoMapper;
using Pharmacy.Core.interfaces;
using Microsoft.AspNetCore.Mvc;
using Pharmacy.API.Controllers;

namespace Ecom.Api.Controllers;

public class BugController : BaseController
{
    public BugController(IUnitOfWork work, IMapper mapper) : base(work, mapper)
    {
    }

    [HttpGet("not-found")]
    public async Task<ActionResult> GetNotFound()
    {
        var catagory = await _unitOfWork.CategoryRepository.GetByIdAsync(42);
        if (catagory == null) return NotFound();
        return Ok(catagory);
    }

    [HttpGet("server-error")]
    public async Task<ActionResult> GetServerError()
    {
        var catagory = await _unitOfWork.CategoryRepository.GetByIdAsync(42);
        catagory.Name = "";
        return Ok(catagory);
    }

    [HttpGet("bad-request/{Id}")]
    public async Task<ActionResult> GetBadRequest(int Id)
    {
        return Ok();
    }

    [HttpGet("bad-request")]
    public async Task<ActionResult> GetBadRequest()
    {
        return BadRequest();
    }
}
