using Microsoft.EntityFrameworkCore;
using Pharmacy.Core.Entities;
using Pharmacy.Core.Interfaces;
using Pharmacy.Infrastructure.Data;

namespace Pharmacy.Infrastructure.Repositories;

public class ReviewRepository : GenericRepositry<Review>, IReviewRepository
{
    private readonly AppDbContext _context;

    public ReviewRepository(AppDbContext context) : base(context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<Review>> GetReviewsByProductAsync(int productId)
        => await _context.Reviews
            .Where(r => r.ProductId == productId)
            .Include(r => r.Reviewer)
            .OrderByDescending(r => r.CreatedAt)
            .AsNoTracking()
            .ToListAsync();

    public async Task<bool> HasUserReviewedProductAsync(string userId, int productId)
        => await _context.Reviews
            .AnyAsync(r => r.UserId == userId && r.ProductId == productId);
}
