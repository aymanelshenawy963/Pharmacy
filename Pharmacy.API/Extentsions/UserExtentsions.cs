using System.Security.Claims;

namespace Pharmacy.API.Extentsions;

public static class UserExtentsions
{
    public static string? GetUserId(this ClaimsPrincipal user) =>
     user.FindFirstValue(ClaimTypes.NameIdentifier);
}

