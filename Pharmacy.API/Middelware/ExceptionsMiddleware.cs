using Pharmacy.Api.Helper;
using Microsoft.Extensions.Caching.Memory;
using System.Text.Json;

namespace Pharmacy.Api.Middelware;

public class ExceptionsMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IHostEnvironment _environment;
    private readonly IMemoryCache _memoryCache;
    private readonly TimeSpan _rateLimitWindow = TimeSpan.FromSeconds(30);

    public ExceptionsMiddleware(RequestDelegate next, IHostEnvironment environment, IMemoryCache memoryCache = null!)
    {
        _next = next;
        _environment = environment;
        _memoryCache = memoryCache;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            ApplySecurityHeaders(context);

            if (!IsRequestAllowed(context))
            {
                context.Response.StatusCode = StatusCodes.Status429TooManyRequests;
                context.Response.ContentType = "application/json";

                var response = new ApiExceptions(
                    StatusCodes.Status429TooManyRequests,
                    "Too many requests. Please try again later."
                );

                var json = JsonSerializer.Serialize(response);

                await context.Response.WriteAsync(json);
                return;
            }

            await _next(context);
        }
        catch (Exception ex)
        {
            context.Response.StatusCode = StatusCodes.Status500InternalServerError;
            context.Response.ContentType = "application/json";

            var response = _environment.IsDevelopment()
                ? new ApiExceptions(500, ex.Message, ex.StackTrace!)
                : new ApiExceptions(500, "Internal Server Error");

            var json = JsonSerializer.Serialize(response);

            await context.Response.WriteAsync(json);
        }
    }

    private bool IsRequestAllowed(HttpContext context)
    {
        var clientIp = context.Connection.RemoteIpAddress?.ToString();
        var cacheKey = $"RateLimit_{clientIp}";
        var dateNow = DateTime.Now;

        var (timestamp, count) = _memoryCache.GetOrCreate(cacheKey, entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = _rateLimitWindow;
            return (timestamp: dateNow, count: 0);
        });

        if (dateNow - timestamp < _rateLimitWindow)
        {
            if (count >= 15)
            {
                return false;
            }

            _memoryCache.Set(cacheKey, (timestamp, count + 1), _rateLimitWindow);
        }
        else
        {
            _memoryCache.Set(cacheKey, (dateNow, 1), _rateLimitWindow);
        }

        return true;
    }

    private void ApplySecurityHeaders(HttpContext context)
    {
        var headers = context.Response.Headers;

        headers["X-Content-Type-Options"] = "nosniff";
        headers["X-Frame-Options"] = "DENY";
        headers["X-XSS-Protection"] = "1; mode=block";
        headers["Content-Security-Policy"] = "default-src 'self'";
        headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains";
        headers["Referrer-Policy"] = "no-referrer";
    }

}

