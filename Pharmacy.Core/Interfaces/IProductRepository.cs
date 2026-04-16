using Pharmacy.Core.DTO;
using Pharmacy.Core.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Pharmacy.Core.Interfaces;

public interface IProductRepository : IGenericRepositry<Product>
{
    Task<ProductToReturnDTO> AddAsync(ProductDTO productDTO);
    Task<bool> UpdateAsync(int id, ProductDTO productDTO);
    Task<bool> DeleteAsync(Product product);
}
