using System;
using System.Collections.Generic;
using System.Text;

namespace Pharmacy.Core.DTO;

public record CategoryDTO
(string Name, string Description);

public record CategoryToReturnDTO(int Id, string Name, string Description);