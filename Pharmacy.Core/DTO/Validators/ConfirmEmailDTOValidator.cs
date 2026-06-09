using FluentValidation;
using System;
using System.Collections.Generic;
using System.Text;

namespace Pharmacy.Core.DTO.Validators;

public class ConfirmEmailDTOValidator : AbstractValidator<ConfirmEmailDTO>
{
    public ConfirmEmailDTOValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("UserId is required.");
        RuleFor(x => x.Code)
            .NotEmpty().WithMessage("Code is required.");
    }
}
