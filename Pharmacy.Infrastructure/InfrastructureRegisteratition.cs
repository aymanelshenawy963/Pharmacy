

using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Pharmacy.Core.Entities;
using Pharmacy.Core.interfaces;
using Pharmacy.Core.Interfaces;
using Pharmacy.Infrastructure.Data;
using Pharmacy.Infrastructure.Repositories;
using Pharmacy.Infrastructure.Repositriers;
using Stripe.Climate;

namespace Pharmacy.Infrastructure;

public static class InfrastructureRegisteratition
{
    public static IServiceCollection InfrastructureConfiguration ( this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped(typeof(IGenericRepositry<>), typeof(GenericRepositry<>));
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        //services.AddScoped<IEmailService, EmailService>();
        //services.AddScoped<IGenerateToken, GenerateToken>();
        //services.AddScoped<IOrderService, OrderService>();
        //services.AddScoped<IPaymentService, PaymentService>();

        // applyDbContext
        services.AddDbContext<AppDbContext>(op =>
           op.UseSqlServer(configuration.GetConnectionString("DefaultConnection"))
        );
        services.AddIdentity<User, IdentityRole>().AddEntityFrameworkStores<AppDbContext>().AddDefaultTokenProviders();


        return services;
    }
}
