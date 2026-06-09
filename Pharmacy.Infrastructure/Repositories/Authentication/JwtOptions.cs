using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Pharmacy.Infrastructure.Repositories.Authentication;

public class JwtOptions
{
    public static string SectionName { get; set; } = "Jwt";

    [Required]
    public string Key { get; init; } = string.Empty;
    [Required]
    public string Issuer { get; init; } = string.Empty;
    [Required]
    public string Audience { get; init; } = string.Empty;
    [Range(1, int.MaxValue)]
    public int ExpireMinutes { get; init; }
}
