using Pharmacy.Core.DTO;
using System;
using System.Collections.Generic;
using System.Text;

namespace Pharmacy.Core.Interfaces.Services;

public interface IUserService
{
    Task<UserProfileDTO> GetProfileAsync(string userId);
    Task UpdateProfileAsync(string userId, UpdateProfileDTO profile);
    Task<(bool IsSuccess, string? Error)> ChangePasswordAsync(string userId, ChangePasswordDTO changePassword);
    Task<IEnumerable<UserToReturnDTO>> GetAllUsersAsync(CancellationToken cancellationToken);
    Task<UserToReturnDTO?> GetAsync(string userId);
    Task<(bool IsSuccess, string? Error)> AddAsync(UserDTO userDTO, CancellationToken cancellationToken);
    Task<(bool IsSuccess, string? Error)> UpdateAsync(string id, UpdateUserDTO updateUser, CancellationToken cancellationToken);
    Task<(bool IsSuccess, string? Error)> ToggleStatusAsync(string id);
    Task<(bool IsSuccess, string? Error)> Unlock(string id);
}
