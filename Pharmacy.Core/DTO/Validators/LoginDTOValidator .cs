using FluentValidation;
using System;
using System.Collections.Generic;
using System.Text;

namespace Pharmacy.Core.DTO.Validators;

public class LoginDTOValidator : AbstractValidator<LoginDTO>
{
    public LoginDTOValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Invalid email format");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required")
            .Matches(RegexPatterns.Password)
            .WithMessage("Password must be at least 8 characters and contain uppercase, lowercase, number and special character");
    }
}
