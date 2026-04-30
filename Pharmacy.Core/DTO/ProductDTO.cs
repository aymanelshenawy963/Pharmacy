using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;

namespace Pharmacy.Core.DTO;


public record ProductDTO
{
    public string Name { get; set; }
    public string Description { get; set; }
    public decimal NewPrice { get; set; }
    public decimal OldPrice { get; set; }
    public int Stock { get; set; }
    public bool RequiresPrescription { get; set; }
    public bool HasStrips { get; set; }
    public int? StripCount { get; set; }
    public bool TopSelling { get; set; }
    public int CategoryId { get; set; }
    public IFormFileCollection Photos { get; set; }
}


public class ProductToReturnDTO
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public decimal NewPrice { get; set; }
    public decimal OldPrice { get; set; }
    public int Stock { get; set; }
    public bool RequiresPrescription { get; set; }
    public bool HasStrips { get; set; }
    public int? StripCount { get; set; }
    public bool TopSelling { get; set; }
    public string CategoryName { get; set; }
    public List<string> Photos { get; set; }
}

public class ProductsToReturnDTO
{
    public List<ProductToReturnDTO> Products { get; set; }
    public int TotalCount { get; set; }

}