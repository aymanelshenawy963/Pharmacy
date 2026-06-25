using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Pharmacy.API.Helpers;
using Pharmacy.Core.DTO;
using Pharmacy.Core.Interfaces.Services;

namespace Pharmacy.API.Controllers;

[Route("[controller]")]
[ApiController]
public class AuthController(IAuthService authService) : ControllerBase
{
    private readonly IAuthService _authService = authService;

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDTO loginDTO, CancellationToken cancellationToken)
    {
        var (auth, error) = await _authService.GetTokenAsync(loginDTO.Email, loginDTO.Password, cancellationToken);

        if (auth is not null)
            return Ok(auth);
        return error == "Email is not confirmed" ? StatusCode(403, new ResponseAPI(403, error))
             : error == "Account is disabled, contact support" ? StatusCode(403, new ResponseAPI(403, error))
             : Unauthorized(new ResponseAPI(401, error));
    }

    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenDTO refreshTokenDTO, CancellationToken cancellationToken)
    {
        var (auth, error) = await _authService.GetRefreshTokenAsync(refreshTokenDTO.Token, refreshTokenDTO.RefreshToken, cancellationToken);

        if (auth is null)
            return error == "Account is disabled, contact support"
                ? StatusCode(403, new ResponseAPI(403, error))
                : Unauthorized(new ResponseAPI(401, error));

        return Ok(auth);
    }

    [HttpPut("revoke-refresh-token")]
    public async Task<IActionResult> RevokeRefreshToken([FromBody] RefreshTokenDTO refreshTokenDTO, CancellationToken cancellationToken)
    {
        var result = await _authService.RevokeRefreshTokenAsync(refreshTokenDTO.Token,refreshTokenDTO.RefreshToken, cancellationToken);
        if (!result)
            return BadRequest(new ResponseAPI(400,"Invalid refresh token"));
        return Ok(new ResponseAPI(200,"Refresh token revoked successfully"));
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDTO registerDTO, CancellationToken cancellationToken)
    {
        var (isSuccess, error) = await _authService.RegisterAsync(registerDTO, cancellationToken);

        if (isSuccess)
            return Ok(new ResponseAPI(200,"Registration successful, please check your email to confirm your account"));

        return error == "Email is already registered" ? Conflict(new ResponseAPI(409, error))
             : error == "Username is already taken" ? Conflict(new ResponseAPI(409, error))
             : BadRequest(new ResponseAPI(400, error));
    }

    [HttpGet("confirm-email")]
    public async Task<IActionResult> ConfirmEmail([FromQuery] ConfirmEmailDTO confirmEmailDTO)
    {
        var (isSuccess, error) = await _authService.ConfirmEmailAsync(confirmEmailDTO);

        if (isSuccess)
            return Ok(new ResponseAPI(200,"Email confirmed successfully, you can now log in"));

        return error == "Email is already confirmed" ? Conflict(new ResponseAPI(409, error))
             : BadRequest(new ResponseAPI(400, error));
    }

    [HttpPost("confirm-email")]
    public async Task<IActionResult> ConfirmEmailByOtp([FromBody] ConfirmEmailOtpDTO request)
    {
        var (isSuccess, error) = await _authService.ConfirmEmailByOtpAsync(request);

        if (isSuccess)
            return Ok(new ResponseAPI(200, "Email confirmed successfully, you can now log in"));

        return error == "Email is already confirmed" ? Conflict(new ResponseAPI(409, error))
             : BadRequest(new ResponseAPI(400, error));
    }

    [HttpPost("resend-confirmation-email")]
    public async Task<IActionResult> ResendConfirmationEmail([FromBody] ResendConfirmEmailDTO request)
    {
        var (isSuccess, error) = await _authService.ResendConfirmationEmailAsync(request);

        if (isSuccess)
            return Ok("If your email is registered, you will receive a confirmation email shortly");

        return Conflict(new ResponseAPI(409, error)); // Email is already confirmed
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgetPasswordDTO forgotPasswordDTO)
    {
        var (isSuccess, error) = await _authService.SendResetPasswordCodeasync(forgotPasswordDTO.Email);

        return isSuccess ? Ok(new ResponseAPI(200,"Password reset code sent successfully"))
             : error == "Email is not confirmed" ? Unauthorized(new ResponseAPI(401, error))
             : BadRequest(new ResponseAPI(400, error));
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDTO resetPasswordDTO)
    {
        var (isSuccess, error) = await _authService.ResetPasswordAsync(resetPasswordDTO);
        if (isSuccess)
            return Ok(new ResponseAPI(200, "Password reset successfully"));
        return BadRequest(new ResponseAPI(400, error));
    }

}
