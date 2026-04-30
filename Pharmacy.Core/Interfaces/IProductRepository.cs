using Pharmacy.Core.DTO;
using Pharmacy.Core.Entities;
using Pharmacy.Core.Sharing;
using System;
using System.Collections.Generic;
using System.Text;

namespace Pharmacy.Core.Interfaces;

public interface IProductRepository : IGenericRepositry<Product>
{
    Task<ProductsToReturnDTO> GetAllAsync(ProductParams productParams);
    Task<ProductToReturnDTO> AddAsync(ProductDTO productDTO);
    Task<bool> UpdateAsync(int id, ProductDTO productDTO);
    Task<bool> DeleteAsync(Product product);
}
