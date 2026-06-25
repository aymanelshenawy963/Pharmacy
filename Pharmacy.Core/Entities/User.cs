using Microsoft.AspNetCore.Identity;
using Pharmacy.Core.Entities.Enums;

namespace Pharmacy.Core.Entities;

public sealed class User : IdentityUser
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;

    public bool IsDisabled { get; set; }

    public Address? Address { get; set; }

    public List<RefreshToken> RefreshTokens { get; set; } = [];

    public EmailOtp? EmailOtp { get; set; }
    public EmailOtp? PasswordResetOtp { get; set; }
}