using System;
using System.Collections.Generic;
using System.Text;

namespace Pharmacy.Core.DTO;


public record ProductDTO(
    string Name,
    string Description,
    decimal NewPrice,
    decimal OldPrice,
    int Stock,
    bool RequiresPrescription,
    bool HasStrips,
    int? StripCount,
    bool TopSelling,
    int CategoryId
);


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
    public List<string> Images { get; set; }
}