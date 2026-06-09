using System;
using System.Collections.Generic;
using System.Text;

namespace Pharmacy.Core.DTO;

public record UserDTO
(
    string Email,
    string UserName,
    string FirstName,
    string LastName,
    string Password,
    IList<string> Roles
);

public record UpdateUserDTO
(
    string Email,
    string UserName,
    string FirstName,
    string LastName,
    IList<string> Roles
);
public record UserToReturnDTO
(
    string Id,
    string Email,
    string UserName,
    string FirstName,
    string LastName,
    bool IsDisabled,
    IEnumerable<string> Roles
);

public record UserProfileDTO
(
    string Email,
    string UserName,
    string FirstName,
    string LastName
);

public record UpdateProfileDTO
(
    string FirstName,
    string LastName
);