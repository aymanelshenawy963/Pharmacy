using Pharmacy.Core.Entities;

namespace Pharmacy.Core.Interfaces;

public interface IReviewRepository : IGenericRepositry<Review>
{
    Task<IReadOnlyList<Review>> GetReviewsByProductAsync(int productId);
    Task<bool> HasUserReviewedProductAsync(string userId, int productId);
}
