using Pharmacy.Core.Entities;
using Pharmacy.Core.interfaces;
using Pharmacy.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace Pharmacy.Infrastructure.Repositories;


public class PhotoRepository : GenericRepositry<Photo>, IPhotoRepository
{
    public PhotoRepository(AppDbContext context) : base(context)
    {
    }
}
