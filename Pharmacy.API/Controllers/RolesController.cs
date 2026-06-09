using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Pharmacy.API.Helpers;
using Pharmacy.Core.Consts;
using Pharmacy.Core.DTO;
using Pharmacy.Core.Interfaces.Services;

namespace Pharmacy.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = DefaultRoles.Admin)]
public class RolesController(IRoleService roleService) : ControllerBase
{
    private readonly IRoleService _roleService = roleService;

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken,[FromQuery] bool? includeDisabled = false)
    {
        var roles = await _roleService.GetAllAsync(cancellationToken,includeDisabled);
        return Ok(roles);
    }

    [HttpPost]
    public async Task<IActionResult> Add([FromBody] RoleDTO role)
    {
        var (isSuccess, error) = await _roleService.AddAsync(role);

        if (!isSuccess)
            return error == "Role already exists" ? Conflict(error) : BadRequest(error);

        return Ok(new ResponseAPI(200, "Role added successfully"));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] RoleDTO role)
    {
        var (isSuccess, error) = await _roleService.UpdateAsync(id, role);
        if (!isSuccess)
            return error == "Role not found" ? NotFound(error) : BadRequest(error);
        return Ok("Role is updated successfully");
    }

    [HttpPut("{id}/toggle-status")]
    public async Task<IActionResult> ToggleStatus(string id)
    {
        var (isSuccess, error) = await _roleService.ToggleStatusAsync(id);
        if (!isSuccess)
            return error == "Role not found" ? NotFound(error) : BadRequest(error);
        return NoContent();
    }
}
