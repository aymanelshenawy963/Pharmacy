using System;
using System.Collections.Generic;
using System.Text;

namespace Pharmacy.Core.Entities;

public class BaseEntity<T>
{
    public T Id { get; set; }
}
