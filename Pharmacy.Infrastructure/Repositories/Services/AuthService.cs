using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Logging;
using Pharmacy.Core.Consts;
using Pharmacy.Core.DTO;
using Pharmacy.Core.Entities;
using Pharmacy.Core.Helpers;
using Pharmacy.Core.Interfaces.Authentication;
using Pharmacy.Core.Interfaces.Services;
using System.Security.Cryptography;
using System.Text;

namespace Pharmacy.Infrastructure.Repositories.Services;

public class AuthService(UserManager<User> userManager, 
    SignInManager<User> signInManager, 
    IMapper mapper,
    IEmailSender emailSender,
    ILogger<AuthService> logger,
    IJwtProvider jwtProvider,
    IHttpContextAccessor httpContextAccessor) : IAuthService
{
    private readonly UserManager<User> _userManager = userManager;
    private readonly IMapper _mapper = mapper;
    private readonly IEmailSender _emailSender = emailSender;
    private readonly ILogger<AuthService> _logger = logger;
    private readonly SignInManager<User> _signInManager = signInManager;
    private readonly IJwtProvider _jwtProvider = jwtProvider;
    private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;
    private readonly int _refreshTokenExpirationDays = 14;

    public async Task<(AuthToReturnDTO? Auth, string? Error)> GetTokenAsync(string email, string password, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
            return (null, "Invalid email or password");

        if(user.IsDisabled)
            return (null, "Account is disabled, contact support");

        var result = await _signInManager.PasswordSignInAsync(user, password, false, true);

        if (result.Succeeded)
        {
            var roles = await _userManager.GetRolesAsync(user);
            var (token, expiresIn) = _jwtProvider.GenerateToken(user,roles);
            var refreshToken = GenerateRefreshToken();
            var refreshTokenExpiration = DateTime.UtcNow.AddDays(_refreshTokenExpirationDays);

            user.RefreshTokens.Add(new RefreshToken
            {
                Token = refreshToken,
                ExpiresOn = refreshTokenExpiration
            });

            await _userManager.UpdateAsync(user);

            return (new AuthToReturnDTO
                (user.Id, user.Email, user.FirstName, user.LastName, token, expiresIn,
                refreshToken, refreshTokenExpiration), null);
        }

        var error = result.IsNotAllowed ? "Email is not confirmed" 
            :result.IsLockedOut ? "Account is locked, try again later"
            : "Invalid email or password";
        return (null, error);

    }


    
    public async Task<(AuthToReturnDTO? Auth, string? Error)> GetRefreshTokenAsync(string token, string refreshToken, CancellationToken cancellationToken)
    {
        var userId = _jwtProvider.ValidateToken(token);
        if (userId == null)
            return (null, "Invalid token");

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return (null, "Invalid token");

        if (user.IsDisabled)
            return (null, "Account is disabled, contact support");

        if(user.LockoutEnd > DateTime.UtcNow)
            return (null, "Account is locked, try again later");

        var userRefreshToken = user.RefreshTokens.SingleOrDefault(rt => rt.Token == refreshToken && rt.IsActive);
        if (userRefreshToken == null)
            return (null, "Invalid refresh token");

        userRefreshToken.RevokedOn = DateTime.UtcNow;
        var roles = await _userManager.GetRolesAsync(user);
        var (newToken, expiresIn) = _jwtProvider.GenerateToken(user, roles);
        var newRefreshToken = GenerateRefreshToken();
        var refreshTokenExpiration = DateTime.UtcNow.AddDays(_refreshTokenExpirationDays);
        user.RefreshTokens.Add(new RefreshToken
        {
            Token = newRefreshToken,
            ExpiresOn = refreshTokenExpiration
        });
        await _userManager.UpdateAsync(user);

        return (new AuthToReturnDTO
            (user.Id, user.Email, user.FirstName, user.LastName, newToken, expiresIn,
            newRefreshToken, refreshTokenExpiration), null);
    }

    public async Task<bool> RevokeRefreshTokenAsync(string token, string refreshToken, CancellationToken cancellationToken)
    {
        var userId = _jwtProvider.ValidateToken(token);
        if (userId == null)
            return false;

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return false;

        var userRefreshToken = user.RefreshTokens.SingleOrDefault(rt => rt.Token == refreshToken && rt.IsActive);
        if (userRefreshToken == null)
            return false;

        userRefreshToken.RevokedOn = DateTime.UtcNow;

        await _userManager.UpdateAsync(user);

        return true;

    }

    public async Task<(bool IsSuccess, string? Error)> SendResetPasswordCodeasync(string email)
    {
        if (await _userManager.FindByEmailAsync(email) is not { } user)
            return (true, null);

        if (!user.EmailConfirmed)
            return (false, "Email is not confirmed");

        var code = await _userManager.GeneratePasswordResetTokenAsync(user);
        code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));

        _logger.LogWarning("Reset password code: {code}", code);

        await SendResetPasswordEmail(user, code);

        return (true, null);
    }
    public async Task<(bool IsSuccess, string? Error)> ResetPasswordAsync(ResetPasswordDTO request)
    {
        if (await _userManager.FindByEmailAsync(request.Email) is not { } user)
            return (false, "Invalid code");

        IdentityResult result;
        try
        {
            var code = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(request.Code));
            result = await _userManager.ResetPasswordAsync(user, code, request.NewPassword);

        }
        catch (FormatException)
        {
            result = IdentityResult.Failed(_userManager.ErrorDescriber.InvalidToken());
        }

        if (result.Succeeded)
            return (true, null);

        var error = result.Errors.First().Description;
        return (false, error);
    }





    public async Task<(bool IsSuccess, string? Error)> RegisterAsync(RegisterDTO registerDTO, CancellationToken cancellationToken)
    {
        // Check if email already exists
        var existingUser = await _userManager.FindByEmailAsync(registerDTO.Email);
        if (existingUser != null)
            return (false, "Email is already registered");

        // Check if username already exists
        var existingUserName = await _userManager.FindByNameAsync(registerDTO.UserName);
        if (existingUserName != null)
            return (false, "Username is already taken");

        var user = _mapper.Map<User>(registerDTO);

        var result = await _userManager.CreateAsync(user, registerDTO.Password);

        if (result.Succeeded)
        {
            var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));

            _logger.LogWarning("Confirmation code: {code}", code);

            await SendConfirmationEmail(user, code);


            return (true, null);
        }

        var error = result.Errors.First().Description;
        return (false, error);
    }


    public async Task<(bool IsSuccess, string? Error)> ConfirmEmailAsync(ConfirmEmailDTO requst)
    {
        if (await _userManager.FindByIdAsync(requst.UserId) is not { } user )
            return (false, "Invalid code");

        if (user.EmailConfirmed)
            return (false, "Email is already confirmed");

        var code = requst.Code;

        try
        {
            code = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(code));
        }
        catch(FormatException)
        {
            return (false, "Invalid code");
        }

        var result = await _userManager.ConfirmEmailAsync(user, code);

        if (result.Succeeded)
        {
            await _userManager.AddToRolesAsync(user, new[] { DefaultRoles.Customer });
            return (true, null);
        }

        var error = result.Errors.First().Description;
        return (false, error);
    }

    public async Task<(bool IsSuccess, string? Error)> ResendConfirmationEmailAsync(ResendConfirmEmailDTO request)
    {
        if (await _userManager.FindByEmailAsync(request.Email) is not { } user)
            return (true, null);

        if (user.EmailConfirmed)
            return (false, "Email is already confirmed");

        var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);
        code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));

        _logger.LogWarning("Confirmation code: {code}", code);

        await SendConfirmationEmail(user, code);

        return (true, null);
    }

    private static string GenerateRefreshToken()
    {
        return Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
    }

    private async Task SendConfirmationEmail(User user,string code)
    {
        var origin = _httpContextAccessor.HttpContext?.Request.Headers.Origin;

        var emailBody = EmailBodyBuilder.GenerateEmailBody("EmailConfirmation",
            templlateModel: new Dictionary<string, string>
            {
                    {"{{name}}",user.FirstName },
                    { "{{action_url}}" , $"{origin}/auth/confirm-email?userId={user.Id}&code={code}" }
            });

        await _emailSender.SendEmailAsync(user.Email!, "✅ Pharmacy : Email Confirmation", emailBody);
    }

    private async Task SendResetPasswordEmail(User user, string code)
    {
        var origin = _httpContextAccessor.HttpContext?.Request.Headers.Origin;

        var emailBody = EmailBodyBuilder.GenerateEmailBody("ForgetPassword",
            templlateModel: new Dictionary<string, string>
            {
                    {"{{name}}",user.FirstName },
                    { "{{action_url}}" , $"{origin}/auth/forget-password?email={user.Email}&code={code}" }
            });

        await _emailSender.SendEmailAsync(user.Email!, "✅ Pharmacy : Change Password", emailBody);
    }
}
