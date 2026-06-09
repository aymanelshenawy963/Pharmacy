using FluentValidation;
using System;
using System.Collections.Generic;
using System.Text;

namespace Pharmacy.Core.DTO.Validators;

public class UserDTOValidator : AbstractValidator<UserDTO>
{
    public UserDTOValidator()
    {
        RuleFor(u => u.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("Invalid email format.");

        RuleFor(u => u.UserName)
            .NotEmpty().WithMessage("Username is required.")
            .MinimumLength(3).WithMessage("Username must be at least 3 characters long.");

        RuleFor(u => u.FirstName)
            .NotEmpty().WithMessage("First name is required.");

        RuleFor(u => u.LastName)
            .NotEmpty().WithMessage("Last name is required.");

        RuleFor(u => u.Password)
            .NotEmpty().WithMessage("Password is required.")
            .Matches(RegexPatterns.Password).WithMessage("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.");

        RuleFor(u => u.Roles)
            .NotNull()
            .NotEmpty().WithMessage("At least one role is required.");

        RuleFor(u=>u.Roles)
            .Must(x=>x.Distinct().Count() == x.Count)
            .WithMessage("You cannot add dupliacted role for the same user")
            .When(u => u.Roles != null);



    }
}
