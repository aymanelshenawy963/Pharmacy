using System;
using System.Collections.Generic;
using System.Text;

namespace Pharmacy.Core.DTO;

public record AuthDTO();


public record AuthToReturnDTO(
    string Id,
    string? Email,
    string FirstName,
    string LastName,
    string Token,
    int ExpiresIn,
    string RefreshToken,
    DateTime RefreshTokenExpiration
    );
