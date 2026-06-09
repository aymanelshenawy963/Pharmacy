using FluentValidation;
using System;
using System.Collections.Generic;
using System.Text;

namespace Pharmacy.Core.DTO.Validators;

public class UpdateUserDTOValidator : AbstractValidator<UpdateUserDTO>
{
    public UpdateUserDTOValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("Invalid email format.");

        RuleFor(x => x.UserName)
            .NotEmpty().WithMessage("Username is required.")
            .MinimumLength(3).WithMessage("Username must be at least 3 characters long.");

        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("First name is required.");

        RuleFor(x => x.LastName)
            .NotEmpty().WithMessage("Last name is required.");

        RuleFor(u => u.Roles)
          .NotNull()
          .NotEmpty().WithMessage("At least one role is required.");

        RuleFor(u => u.Roles)
            .Must(x => x.Distinct().Count() == x.Count)
            .WithMessage("You cannot add dupliacted role for the same user")
            .When(u => u.Roles != null);
    }
}
