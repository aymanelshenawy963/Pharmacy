using Pharmacy.Core.interfaces;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json;

namespace Pharmacy.Infrastructure.Repositories;

public class BasketRepository(IConnectionMultiplexer redis) : IBasketRepository
{
    private readonly IDatabase _database = redis.GetDatabase();

    public async Task<Basket?> GetBasketAsync(string id)
    {
        var result = await _database.StringGetAsync(id);

        if (!result.IsNullOrEmpty)
            return JsonSerializer.Deserialize<Basket>(result.ToString());

        return null;
    }
    public async Task<Basket?> UpdateBasketAsync(Basket basket)
    {
        var isStored = await _database.StringSetAsync(basket.Id, JsonSerializer.Serialize(basket), TimeSpan.FromDays(3));

        if (isStored)
        {
            return await GetBasketAsync(basket.Id);
        }
        return null;
    }

    public Task<bool> DeleteBasketAsync(string id)
    {
        return _database.KeyDeleteAsync(id);
    }
}
