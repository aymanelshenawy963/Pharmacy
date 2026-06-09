using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Pharmacy.API.Extentsions;
using Pharmacy.Core.DTO;
using Pharmacy.Core.Interfaces.Services;

namespace Pharmacy.API.Controllers;

[Route("me")]
[ApiController]
[Authorize]
public class AccountController(IUserService userService) : ControllerBase
{
    private readonly IUserService _userService = userService;

    [HttpGet("profile")]
    public async Task<ActionResult<UserProfileDTO>> GetProfile()
    {
        var result = await _userService.GetProfileAsync(User.GetUserId()!);
        return Ok(result);
    }

    [HttpPut("update-profile")]
    public async Task<IActionResult> UpdateProfile([FromBody]UpdateProfileDTO profile)
    {
        await _userService.UpdateProfileAsync(User.GetUserId()!, profile);
        return NoContent();
    }

    [HttpPut("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody]ChangePasswordDTO changePassword)
    {
        var (isSuccess, error) = await _userService.ChangePasswordAsync(User.GetUserId()!, changePassword);
        if (!isSuccess)
            return BadRequest(error);
        return NoContent();
    }
}
