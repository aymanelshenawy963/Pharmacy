using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Pharmacy.Core.Entities;

public class Photo : BaseEntity<int>
{
    public string ImageName { get; set; } = string.Empty;

    public int ProductId { get; set; }
    [ForeignKey(nameof(ProductId))]
    public virtual Product Product { get; set; } = default!;
}