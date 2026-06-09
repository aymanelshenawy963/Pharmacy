using System;
using System.Collections.Generic;
using System.Text;

namespace Pharmacy.Core.DTO;


public record RoleDTO(
    string Name
);
public record RoleToReturnDTO(
    string Id,
    string Name,
    bool IsDeleted  );

