using Microsoft.EntityFrameworkCore;

namespace Pharmacy.Core.Entities;

[Owned]
public class EmailOtp
{
    public string? Code { get; set; }
    public DateTime? ExpiresOn { get; set; }

    public bool IsExpired => ExpiresOn.HasValue && DateTime.UtcNow >= ExpiresOn.Value;
    public bool IsValid(string code) => Code == code && !IsExpired;
}
