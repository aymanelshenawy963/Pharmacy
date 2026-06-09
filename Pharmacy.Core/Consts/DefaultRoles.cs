using System;
using System.Collections.Generic;
using System.Text;

namespace Pharmacy.Core.Consts;

public static class DefaultRoles
{
    public const string Admin = nameof(Admin);
    public const string AdminRoleId = "22ea0339-4041-4281-9e76-9124589dd633";
    public const string AdminRoleConcurrencyStamp = "def11b2f-0159-4906-bed8-86abb529c996";

    public const string Customer = nameof(Customer);
    public const string CustomerRoleId = "c70933bd-f3cf-4e7f-83d9-a10f5dc9799f";
    public const string CustomerRoleConcurrencyStamp = "01530506-21fa-40cd-8e5e-6b86251892c1";
}
