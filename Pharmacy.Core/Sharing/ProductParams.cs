

namespace Pharmacy.Core.Sharing;


public class ProductParams
{
    public string? Sort { get; set; }
    public int? CategoryId { get; set; }

    public string? Search { get; set; }
    private int MaxPageSize { get; set; } = 6;

    private int _pageSize = 3;
    public int PageSize
    {
        get => _pageSize;
        set
        {
            if (value <= 0)
                _pageSize = 3; // default
            else
                _pageSize = value > MaxPageSize ? MaxPageSize : value;
        }
    }

    private int _pageNumber = 1;

    public int PageNumber
    {
        get => _pageNumber;
        set => _pageNumber = value < 1 ? 1 : value;
    }
}
