using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pharmacy.API.Extentsions;
using Pharmacy.API.Helpers;
using Pharmacy.Core.Consts;
using Pharmacy.Core.DTO;
using Pharmacy.Core.Entities;
using Pharmacy.Core.interfaces;

namespace Pharmacy.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ReviewsController(IUnitOfWork unitOfWork, IMapper mapper) : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork = unitOfWork;
    private readonly IMapper _mapper = mapper;

    /// <summary>GET /api/reviews/{productId} — Public: returns all reviews for a product.</summary>
    [HttpGet("{productId:int}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetProductReviews(int productId)
    {
        var reviews = await _unitOfWork.ReviewRepository.GetReviewsByProductAsync(productId);
        return Ok(_mapper.Map<IReadOnlyList<ReviewDTO>>(reviews));
    }

    /// <summary>POST /api/reviews — Customer submits a review. One review per product per user.</summary>
    [HttpPost]
    [Authorize(Roles = DefaultRoles.Customer)]
    public async Task<IActionResult> AddReviewAsync([FromBody] CreateReviewDTO dto)
    {
        var userId = User.GetUserId();
        if (userId is null)
            return Unauthorized(new ResponseAPI(401));

        var alreadyReviewed = await _unitOfWork.ReviewRepository
            .HasUserReviewedProductAsync(userId, dto.ProductId);

        if (alreadyReviewed)
            return BadRequest(new ResponseAPI(400, "You have already reviewed this product."));

        var product = await _unitOfWork.ReviewRepository
    .GetByIdAsync(dto.ProductId);

        if (product is null)
            return NotFound(new ResponseAPI(404, "Product not found."));

        var review = new Review
        {
            ProductId = dto.ProductId,
            UserId    = userId,
            Rating    = dto.Rating,
            Comment   = dto.Comment
        };

        await _unitOfWork.ReviewRepository.AddAsync(review);

        // Re-query with the Reviewer navigation to populate ReviewerName in the response
        var saved = await _unitOfWork.ReviewRepository
            .GetByIdAsync(review.Id, r => r.Reviewer);

        return CreatedAtAction(
            nameof(GetProductReviews),
            new { productId = review.ProductId },
            _mapper.Map<ReviewDTO>(saved));
    }
}
