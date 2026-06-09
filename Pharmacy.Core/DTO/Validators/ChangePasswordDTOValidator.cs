using FluentValidation;
using System;
using System.Collections.Generic;
using System.Text;

namespace Pharmacy.Core.DTO.Validators;

public class ChangePasswordDTOValidator : AbstractValidator<ChangePasswordDTO>
{
    public ChangePasswordDTOValidator()
    {
        RuleFor(x => x.CurrentPassword)
        .NotEmpty().WithMessage("Password is required");

        RuleFor(x => x.NewPassword)
        .NotEmpty().WithMessage("Password is required")
        .Matches(RegexPatterns.Password)
        .WithMessage("Password must be at least 8 characters and contain uppercase, lowercase, number and special character")
        .NotEqual(x => x.CurrentPassword).WithMessage("New password must be different from current password");


    }
}
