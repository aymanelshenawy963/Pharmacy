using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Pharmacy.Core.Consts;
using Pharmacy.Core.DTO;
using Pharmacy.Core.Entities;
using Pharmacy.Core.Interfaces.Services;
using Pharmacy.Infrastructure.Data;
using System;


namespace Pharmacy.Infrastructure.Repositories.Services;

public class UserService(UserManager<User> userManager, IMapper mapper,
    IRoleService roleService, AppDbContext context) : IUserService
{
    private readonly UserManager<User> _userManager = userManager;
    private readonly IMapper _mapper = mapper;
    private readonly IRoleService _roleService = roleService;
    private readonly AppDbContext _context = context;

    public async Task<IEnumerable<UserToReturnDTO>> GetAllUsersAsync(CancellationToken cancellationToken) =>
        await (from u in _context.Users
               join ur in _context.UserRoles
               on u.Id equals ur.UserId into userRoles
               from ur in userRoles.DefaultIfEmpty()
               join r in _context.Roles
               on ur.RoleId equals r.Id into roles
               select new
                       {
                           u.Id,
                           u.Email,
                           u.UserName,
                           u.FirstName,
                           u.LastName,
                           u.IsDisabled,
                           Roles = roles.Select(x => x.Name).ToList()!
                       }
               )
                .GroupBy(u => new { u.Id, u.Email, u.UserName, u.FirstName, u.LastName, u.IsDisabled })
                 .Select(g => new UserToReturnDTO
                     (
                         g.Key.Id,
                         g.Key.Email,
                         g.Key.UserName,
                         g.Key.FirstName,
                         g.Key.LastName,
                         g.Key.IsDisabled,
                   g.SelectMany(x => x.Roles).ToList()
                     ))
                .ToListAsync(cancellationToken);

    // الادمن اللي بيشوف البيانات (UsersController)
    public async Task<UserToReturnDTO?> GetAsync(string userId) =>
        await (from u in _context.Users
               where u.Id == userId
               join ur in _context.UserRoles
               on u.Id equals ur.UserId
               join r in _context.Roles
               on ur.RoleId equals r.Id into roles
               select new
               {
                   u.Id,
                   u.Email,
                   u.UserName,
                   u.FirstName,
                   u.LastName,
                   u.IsDisabled,
                   Roles = roles.Select(x => x.Name).ToList()
               })
            .GroupBy(u => new { u.Id, u.Email, u.UserName, u.FirstName, u.LastName, u.IsDisabled })
            .Select(g => new UserToReturnDTO(
                g.Key.Id,
                g.Key.Email,
                g.Key.UserName,
                g.Key.FirstName,
                g.Key.LastName,
                g.Key.IsDisabled,
                g.SelectMany(x => x.Roles).ToList()
            ))
            .SingleOrDefaultAsync();

    // بشوف بيانتي (AccountController)
    public async Task<UserProfileDTO> GetProfileAsync(string userId)
    {
        return await _userManager.Users
            .Where(u => u.Id == userId)
            .ProjectTo<UserProfileDTO>(_mapper.ConfigurationProvider)
            .SingleAsync();
    }

    public async Task<(bool IsSuccess, string? Error)> AddAsync(UserDTO userDTO , CancellationToken cancellationToken)
    {
        var emailIsExists = await _userManager.Users.AnyAsync(u => u.Email == userDTO.Email, cancellationToken);
        if (emailIsExists)
            return (false, "Email is already exists");

        var userNameIsExists = await _userManager.Users.AnyAsync(u => u.UserName == userDTO.UserName, cancellationToken);
        if (userNameIsExists)
            return (false, "UserName is already exists");

        var allowedRoles = await _roleService.GetAllAsync(cancellationToken:cancellationToken);
        if (userDTO.Roles.Except(allowedRoles.Select(x=>x.Name)).Any())
            return (false, "One or more roles are invalid");

        var user = _mapper.Map<User>(userDTO);

        var result = await _userManager.CreateAsync(user, userDTO.Password);
      
        if(result.Succeeded)
        {
            await _userManager.AddToRolesAsync(user, userDTO.Roles);
            return (true, null);
        }

        var error = result.Errors.First().Description;
        return (false, error);

    }

    // الادمن اللي بيحدث البيانات(UsersController)
    public async Task<(bool IsSuccess, string? Error)> UpdateAsync(string id,UpdateUserDTO updateUser , CancellationToken cancellationToken)
    {
        var emailIsExists = await _userManager.Users.AnyAsync(u => u.Email == updateUser.Email && u.Id != id, cancellationToken);
        if (emailIsExists)
            return (false, "Email is already exists");

        var userNameIsExists = await _userManager.Users.AnyAsync(u => u.UserName == updateUser.UserName && u.Id != id, cancellationToken);
        if (userNameIsExists)
            return (false, "UserName is already exists");

        var allowedRoles = await _roleService.GetAllAsync(cancellationToken: cancellationToken);    
        if (updateUser.Roles.Except(allowedRoles.Select(x => x.Name)).Any())
            return (false, "One or more roles are invalid");


        if(await _userManager.FindByIdAsync(id) is not { } user)
            return (false, "User not found");

        _mapper.Map(updateUser, user);

        var result = await _userManager.UpdateAsync(user);

        if (result.Succeeded)
        {
            //var userRoles = await _userManager.GetRolesAsync(user);
            //var rolesToRemove = userRoles.Except(updateUser.Roles);
            //var rolesToAdd = updateUser.Roles.Except(userRoles);
            //if (rolesToRemove.Any())
            //    await _userManager.RemoveFromRolesAsync(user, rolesToRemove);
            //if (rolesToAdd.Any())
            //    await _userManager.AddToRolesAsync(user, rolesToAdd);

            //حل اخر
            await _context.UserRoles.Where(ur => ur.UserId == id).ExecuteDeleteAsync(cancellationToken);
            await _userManager.AddToRolesAsync(user, updateUser.Roles);
            return (true, null);
        }

        var error = result.Errors.First().Description;
        return (false, error);

    }

    //  بحدث بيانتي (AccountController)
    public async Task UpdateProfileAsync(string userId, UpdateProfileDTO profile)
    {
        //var user = await _userManager.FindByIdAsync(userId);
        //_mapper.Map(profile, user);
        //await _userManager.UpdateAsync(user!);

        await _userManager.Users
            .Where(u => u.Id == userId)
            .ExecuteUpdateAsync(setters =>
            setters
                   .SetProperty(x => x.FirstName , profile.FirstName)
                   .SetProperty(x => x.LastName , profile.LastName)
                   );

    }

    public async Task<(bool IsSuccess, string? Error)> ToggleStatusAsync(string id)
    {
        if(await _userManager.FindByIdAsync(id) is not { } user)
            return (false, "User not found");

        user.IsDisabled = !user.IsDisabled;
        await _userManager.UpdateAsync(user);
        
       return (true, null);

    }

    public async Task<(bool IsSuccess, string? Error)> Unlock(string id)
    {
        if (await _userManager.FindByIdAsync(id) is not { } user)
            return (false, "User not found");

        var result = await _userManager.SetLockoutEndDateAsync(user, null);

        if (result.Succeeded)
            return (true, null);

        var error = result.Errors.First().Description;
        return (false, error);



    }


    // (AccountController)
    public async Task<(bool IsSuccess, string? Error)> ChangePasswordAsync(string userId, ChangePasswordDTO changePassword)
    {
        var user = await _userManager.FindByIdAsync(userId);

        var result = await _userManager.ChangePasswordAsync(user!, changePassword.CurrentPassword, changePassword.NewPassword);

        if (result.Succeeded)
            return (true, null);

        var error = result.Errors.First().Description;
        return (false, error);
    }

   
}



