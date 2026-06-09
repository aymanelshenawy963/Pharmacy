using System;
using System.Collections.Generic;
using System.Text;

namespace Pharmacy.Core.DTO;

public record ResetPasswordDTO
(
    string Email,
    string Code,
    string NewPassword
);
