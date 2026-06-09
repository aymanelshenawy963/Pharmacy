using System;
using System.Collections.Generic;
using System.Text;

namespace Pharmacy.Core.DTO;

public record LoginDTO
(
     string Email,
     string Password 
);