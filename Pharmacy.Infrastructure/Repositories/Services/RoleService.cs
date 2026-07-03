using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Pharmacy.Core.DTO;
using Pharmacy.Core.Entities;
using Pharmacy.Core.Interfaces.Services;
using System;
using System.Collections.Generic;
using System.Text;

namespace Pharmacy.Infrastructure.Repositories.Services;

public class RoleService(RoleManager<ApplicationRole> roleManager,IMapper mapper) : IRoleService
{
    private readonly RoleManager<ApplicationRole> _roleManager = roleManager;
    private readonly IMapper _mapper = mapper;

    public async Task<IEnumerable<RoleToReturnDTO>> GetAllAsync(CancellationToken cancellationToken, bool? icludeDisabled = false, bool? includeDefault = false) =>
        await _roleManager.Roles
            .Where(x => (!x.IsDefault || includeDefault == true) && (!x.IsDeleted || icludeDisabled == true)) 
            .ProjectTo<RoleToReturnDTO>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);

    public async Task<(bool IsSuccess, string? Error)> AddAsync(RoleDTO role)
    {
        var roleIsExists = await _roleManager.RoleExistsAsync(role.Name);
        if (roleIsExists)
            return (false, "Role already exists");

        var newRole = _mapper.Map<ApplicationRole>(role);
        var result = await _roleManager.CreateAsync(newRole);

        if (!result.Succeeded)
            return (false, result.Errors.First().Description);

        return (true, null);
    }

    public async Task<(bool IsSuccess, string? Error)> UpdateAsync(string id, RoleDTO role)
    {
        var existingRole = await _roleManager.FindByIdAsync(id);

        if (existingRole == null)
            return (false, "Role not found");

        existingRole.Name = role.Name;

        var result = await _roleManager.UpdateAsync(existingRole);
        if (!result.Succeeded)
            return (false, result.Errors.First().Description);
        return (true, null);
    }

     public async Task<(bool IsSuccess, string? Error)> ToggleStatusAsync(string id)
    {
        var role = await _roleManager.FindByIdAsync(id);
        if (role == null)
            return (false, "Role not found");

        role.IsDeleted = !role.IsDeleted;
        await _roleManager.UpdateAsync(role);

        return (true, null);
    }


}
