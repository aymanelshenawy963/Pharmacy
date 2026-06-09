using System;
using System.Collections.Generic;
using System.Text;

namespace Pharmacy.Core.DTO;

public record RegisterDTO
    (
     string Email,
     string UserName,
     string Password,
     string FirstName,
     string LastName
    );

