using Hangfire;
using Pharmacy.Core.Interfaces.Services;

namespace Pharmacy.API.BackgroundJobs;

/// <summary>
/// Registered as a Hangfire recurring job (every minute).
/// This class is intentionally thin — it only resolves the service and delegates.
/// All business decisions live in INotificationService.
/// </summary>
public class StockMonitoringJob(INotificationService notificationService)
{
    public const string JobId = "stock-monitoring";

    [AutomaticRetry(Attempts = 3)]
    public async Task ExecuteAsync()
        => await notificationService.MonitorStockAsync();
}
