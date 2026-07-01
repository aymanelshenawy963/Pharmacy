namespace Pharmacy.Core.Settings;

public class StripeSettings
{
    public const string SectionName = "StripeSettings";
    public string PublishableKey { get; set; } = string.Empty;
    public string SecretKey { get; set; } = string.Empty;
}
