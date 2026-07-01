using System.ComponentModel.DataAnnotations;

namespace Pharmacy.Core.DTO;

public class ReviewDTO
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string ReviewerName { get; set; } = string.Empty;
    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class CreateReviewDTO
{
    [Required]
    public int ProductId { get; set; }

    [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5.")]
    public int Rating { get; set; }

    [Required]
    [MaxLength(1000)]
    public string Comment { get; set; } = string.Empty;
}
