using System;
using System.Collections.Generic;
using System.Text;

namespace Pharmacy.Core.DTO;

public record ChangePasswordDTO
(
    string CurrentPassword,
    string NewPassword
);
