using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.IdentityModel.Tokens.Experimental;
using Pharmacy.Core.DTO.Validators;
using Pharmacy.Core.Entities;
using Pharmacy.Core.Errors;
using Pharmacy.Core.interfaces;
using Pharmacy.Core.Interfaces;
using Pharmacy.Core.Interfaces.Authentication;
using Pharmacy.Core.Interfaces.Services;
using Pharmacy.Core.Settings;
using Pharmacy.Infrastructure.Data;
using Pharmacy.Infrastructure.Repositories;
using Pharmacy.Infrastructure.Repositories.Authentication;
using Pharmacy.Infrastructure.Repositories.Services;
using Pharmacy.Infrastructure.Repositriers;
using Pharmacy.Infrastructure.Repositriers.Service;
using StackExchange.Redis;
using System.Text;
using Hangfire;


namespace Pharmacy.Infrastructure;

public static class InfrastructureRegisteratition
{
    public static IServiceCollection InfrastructureConfiguration ( this IServiceCollection services, IConfiguration configuration)
    {


        services.AddScoped(typeof(IGenericRepositry<>), typeof(GenericRepositry<>));
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<INotificationService, NotificationService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IEmailSender, EmailService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IRoleService, RoleService>();
        services.AddScoped<IOrderService, OrderService>();
        services.AddScoped<IPaymentService, PaymentService>();

        services.AddOptions<StripeSettings>()
            .Bind(configuration.GetSection(StripeSettings.SectionName))
            .ValidateDataAnnotations()
            .ValidateOnStart();

        services.AddSingleton<IImageMangementService, ImageMangementService>();
        services.AddSingleton<IJwtProvider, JwtProvider>();
        services.AddSingleton<IFileProvider>(new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot")));

        services.AddFluentValidationAutoValidation();
        services.AddValidatorsFromAssemblyContaining<RegisterDTOValidator>(); // بس السطر ده كفاية


        services.AddExceptionHandler<GlobalExceptionHandelar>();
        services.AddProblemDetails();

        services.Configure<MailSettings>(configuration.GetSection(nameof(MailSettings)));

        services.AddHttpContextAccessor();

        //apply redis connection
        services.AddSingleton<IConnectionMultiplexer>(sp =>
        {
            var redisConnection = configuration.GetConnectionString("Redis")
                                  ?? throw new InvalidOperationException("Redis connection string not found");
            var configurationOptions = ConfigurationOptions.Parse(redisConnection);
            return ConnectionMultiplexer.Connect(configurationOptions);
        });




        // applyDbContext
        services.AddDbContext<AppDbContext>(op =>
           op.UseSqlServer(configuration.GetConnectionString("DefaultConnection"))
        );


        // Auth Configuration
        services.AddIdentity<User, ApplicationRole>()
            .AddEntityFrameworkStores<AppDbContext>()
            .AddDefaultTokenProviders();

        //services.Configure<JwtOptions>(configuration.GetSection(JwtOptions.SectionName));
        services.AddOptions<JwtOptions>()
            .Bind(configuration.GetSection(JwtOptions.SectionName))
            .ValidateDataAnnotations()
            .ValidateOnStart();

        var jwtSettings = configuration.GetSection(JwtOptions.SectionName).Get<JwtOptions>();

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(o =>
        {
            o.SaveToken = true;
            o.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings?.Key!)),
                ValidIssuer = jwtSettings?.Issuer,
                ValidAudience = jwtSettings?.Audience

            };
        });

        services.Configure<IdentityOptions>(options =>
        {
            options.Password.RequiredLength = 8;
            options.SignIn.RequireConfirmedEmail = true;
            options.User.RequireUniqueEmail = true;
        });




        // Hangfire — uses the same SQL Server connection as the app
        services.AddHangfire(cfg => cfg
        .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
        .UseSimpleAssemblyNameTypeSerializer()
        .UseRecommendedSerializerSettings()
        .UseSqlServerStorage(configuration.GetConnectionString("DefaultConnection")));

        services.AddHangfireServer(options =>
        {
            options.WorkerCount = 2; // keep low — monitoring jobs are lightweight
        });







        return services;
    }
}
