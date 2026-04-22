namespace Pharmacy.API.Helpers;

public class Pagination<T>(int pageIndex, int pageSize, int totalCount, IEnumerable<T> data) where T : class
{
    public int PageIndex { get; set; } = pageIndex;
    public int PageSize { get; set; } = pageSize;
    public int TotalCount { get; set; } = totalCount;
    public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
    public IEnumerable<T> Data { get; set; } = data;
}
