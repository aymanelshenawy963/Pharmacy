using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Pharmacy.API.Helpers;
using Pharmacy.Core.DTO;
using Pharmacy.Core.Interfaces.Services;

namespace Pharmacy.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "Admin")]
public class UsersController(IUserService userService) : ControllerBase
{
    private readonly IUserService _userService = userService;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserToReturnDTO>>> GetAllUsers(CancellationToken cancellationToken)
    {
        var users = await _userService.GetAllUsersAsync(cancellationToken);
        return Ok(users);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserToReturnDTO>> GetUserById(string id)
    {
        var user = await _userService.GetAsync(id);
        if (user == null)
            return NotFound(new ResponseAPI(404,"User is not found"));
        return Ok(user);
    }

    [HttpPost]
    public async Task<ActionResult> AddUser([FromBody] UserDTO userDTO, CancellationToken cancellationToken)
    {
        var result = await _userService.AddAsync(userDTO, cancellationToken);
        if (!result.IsSuccess)
            return BadRequest(new ResponseAPI(400, result.Error!));
        return Ok(new ResponseAPI(200, "User added successfully"));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateUser(string id, [FromBody] UpdateUserDTO updateUser, CancellationToken cancellationToken)
    {
        var result = await _userService.UpdateAsync(id, updateUser, cancellationToken);
        if (!result.IsSuccess)
            return BadRequest(new ResponseAPI(400, result.Error!));
        return Ok(new ResponseAPI(200, "User updated successfully"));
    }

    [HttpPut("{id}/toggle-status")]
    public async Task<IActionResult> ToggleStatus(string id)
    {
        var result = await _userService.ToggleStatusAsync(id);
        return result.IsSuccess ? Ok(result) : BadRequest(new ResponseAPI(400, result.Error!));
    }

    [HttpPut("{id}/unlock")]
    public async Task<IActionResult> Unlock(string id)
    {
        var result = await _userService.Unlock(id);
        return result.IsSuccess ? NoContent() : BadRequest(new ResponseAPI(400, result.Error!));
    }


}
