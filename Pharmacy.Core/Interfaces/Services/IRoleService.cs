using Pharmacy.Core.DTO;
using System;
using System.Collections.Generic;
using System.Text;

namespace Pharmacy.Core.Interfaces.Services;

public interface IRoleService
{
    Task<IEnumerable<RoleToReturnDTO>> GetAllAsync(CancellationToken cancellationToken, bool? icludeDisabled = false, bool? includeDefault = false);
    Task<(bool IsSuccess, string? Error)> AddAsync(RoleDTO role);
    Task<(bool IsSuccess, string? Error)> UpdateAsync(string id, RoleDTO role);
     Task<(bool IsSuccess, string? Error)> ToggleStatusAsync(string id);
}
