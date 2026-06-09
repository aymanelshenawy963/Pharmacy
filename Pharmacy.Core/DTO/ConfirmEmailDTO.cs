using System;
using System.Collections.Generic;
using System.Text;

namespace Pharmacy.Core.DTO;

public record ConfirmEmailDTO
(
    string UserId,
    string Code
);
