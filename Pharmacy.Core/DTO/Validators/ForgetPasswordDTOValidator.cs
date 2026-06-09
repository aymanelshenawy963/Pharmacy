using FluentValidation;
using System;
using System.Collections.Generic;
using System.Text;

namespace Pharmacy.Core.DTO.Validators;

public class ForgetPasswordDTOValidator : AbstractValidator<ForgetPasswordDTO>
{
    public ForgetPasswordDTOValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("Invalid email format.");
    }
}
