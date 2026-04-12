
using Pharmacy.Core.Entities;
using Pharmacy.Core.interfaces;
using Pharmacy.Infrastructure.Data;
using Pharmacy.Infrastructure.Repositories;
using System;
using System.Collections.Generic;
using System.Text;

namespace Pharmacy.Infrastructure.Repositriers;

public class CategoryRepository : GenericRepositry<Category>, ICategoryRepository
{
    public CategoryRepository(AppDbContext context) : base(context)
    {
    }
}
