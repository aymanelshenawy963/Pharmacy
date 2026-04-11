

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Pharmacy.Infrastructure.Data;

namespace Pharmacy.Infrastructure;

public static class InfrastructureRegisteratition
{
    public static IServiceCollection InfrastructureConfiguration ( this IServiceCollection services, IConfiguration configuration)
    {

        // applyDbContext
        services.AddDbContext<AppDbContext>(op =>
           op.UseSqlServer(configuration.GetConnectionString("DefaultConnection"))
        );


        return services;
    }
}
