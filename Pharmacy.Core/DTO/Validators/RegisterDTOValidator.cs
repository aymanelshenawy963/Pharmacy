using System;
using System.Collections.Generic;
using System.Text;
using FluentValidation;

namespace Pharmacy.Core.DTO.Validators;

public class RegisterDTOValidator : AbstractValidator<RegisterDTO>
{
        public RegisterDTOValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Invalid email format");

            RuleFor(x => x.UserName)
                .NotEmpty().WithMessage("Username is required")
                .Length(3, 20).WithMessage("Username must be between 3 and 20 characters");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password is required")
                .Matches(RegexPatterns.Password)
                .WithMessage("Password must be at least 8 characters and contain uppercase, lowercase, number and special character");

            RuleFor(x => x.FirstName)
                .NotEmpty().WithMessage("First name is required")
                .Length(3, 100).WithMessage("First name must be between 3 and 100 characters");

            RuleFor(x => x.LastName)
                .NotEmpty().WithMessage("Last name is required")
                .Length(3, 100).WithMessage("Last name must be between 3 and 100 characters");
        }
    
} 