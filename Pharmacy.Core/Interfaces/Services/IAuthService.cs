using Pharmacy.Core.DTO;
using System;
using System.Collections.Generic;
using System.Text;

namespace Pharmacy.Core.Interfaces.Services;

public interface IAuthService
{
    Task<(AuthToReturnDTO? Auth, string? Error)> GetTokenAsync(string email, string password,CancellationToken cancellationToken);
    Task<(AuthToReturnDTO? Auth, string? Error)> GetRefreshTokenAsync(string token, string refreshToken, CancellationToken cancellationToken);
    Task<bool> RevokeRefreshTokenAsync(string token, string refreshToken, CancellationToken cancellationToken);
    Task<(bool IsSuccess, string? Error)> RegisterAsync(RegisterDTO registerDTO, CancellationToken cancellationToken);
    Task<(bool IsSuccess, string? Error)> ConfirmEmailAsync(ConfirmEmailDTO requst);
    Task<(bool IsSuccess, string? Error)> ResendConfirmationEmailAsync(ResendConfirmEmailDTO request);
    Task<(bool IsSuccess, string? Error)> SendResetPasswordCodeasync(string email);
    Task<(bool IsSuccess, string? Error)> ResetPasswordAsync(ResetPasswordDTO request);

}
