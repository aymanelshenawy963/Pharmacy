using Pharmacy.Core.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Pharmacy.Core.Interfaces.Authentication;

public interface IJwtProvider
{
    (string Token, int ExpiresIn) GenerateToken(User user, IEnumerable<string> roles);
    string? ValidateToken(string token);
}
