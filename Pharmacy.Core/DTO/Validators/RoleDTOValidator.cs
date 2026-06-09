using FluentValidation;
using System;
using System.Collections.Generic;
using System.Text;

namespace Pharmacy.Core.DTO.Validators;

public class RoleDTOValidator : AbstractValidator<RoleDTO>
{
    public RoleDTOValidator()
    {
        RuleFor(x => x.Name).NotEmpty().Length(3, 50);
    }
}
