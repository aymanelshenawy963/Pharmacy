using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json;

namespace Pharmacy.Infrastructure.Repositories;

public class BasketRepository
{
    private readonly IDatabase _database;

    public BasketRepository(IConnectionMultiplexer redis)
    {
        _database = redis.GetDatabase();
    }
    public async Task<Basket> GetBasketAsync(string id)
    {
        var result = await _database.StringGetAsync(id);

        if (result.IsNullOrEmpty) return null;

        return JsonSerializer.Deserialize<Basket>(result.ToString());
    }
    public async Task<Basket> UpdateBasketAsync(Basket basket)
    {
        var _basket = await _database.StringSetAsync(basket.Id, JsonSerializer.Serialize(basket), TimeSpan.FromDays(3));

        if (_basket)
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
