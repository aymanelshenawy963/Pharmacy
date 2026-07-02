using Hangfire;
using HangfireBasicAuthenticationFilter;
using Pharmacy.Api.Middelware;
using Pharmacy.API.BackgroundJobs;
using Pharmacy.Core.Mapping;
using Pharmacy.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactAppPolicy", policy =>
    {
        policy.AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials()
              .WithOrigins(
                    "http://localhost:5173",
                    "https://localhost:5173"
                );// Replace with your React app's URL;
    });
});


builder.Services.AddMemoryCache();
builder.Services.AddControllers()
    .AddJsonOptions(options =>
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter()));


// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddSwaggerGen();

builder.Services.AddAutoMapper(cfg => { }, typeof(MappingAssemblyMarker).Assembly);

builder.Services.InfrastructureConfiguration(builder.Configuration);



var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("ReactAppPolicy");
app.UseMiddleware<ExceptionsMiddleware>();
app.UseStaticFiles();

app.UseStatusCodePagesWithReExecute("/errors/{0}");

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Hangfire Dashboard (admin only — restrict in production)
app.UseHangfireDashboard("/hangfire", new DashboardOptions
{
    Authorization =
    [
        new HangfireCustomBasicAuthenticationFilter
        {
            User = app.Configuration.GetValue<string>("HangfireSettings:UserName"),
            Pass = app.Configuration.GetValue<string>("HangfireSettings:Password")
        }
    ],
    DashboardTitle = "Pharmacy - Hangfire Dashboard"

});

// Register the recurring stock-monitoring job — every hour
RecurringJob.AddOrUpdate<StockMonitoringJob>(
    StockMonitoringJob.JobId,
    job => job.ExecuteAsync(),
    Cron.Hourly());

app.UseExceptionHandler();

app.Run();
