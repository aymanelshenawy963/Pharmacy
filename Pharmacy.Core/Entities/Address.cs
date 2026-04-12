
using System.ComponentModel.DataAnnotations.Schema;


namespace Pharmacy.Core.Entities;

public class Address : BaseEntity<int>
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string City { get; set; }
    public string Street { get; set; }
    public string State { get; set; }
    public string ZipCode { get; set; }

    public string UserId { get; set; }
    [ForeignKey(nameof(UserId))]
    public virtual User User { get; set; }
}
