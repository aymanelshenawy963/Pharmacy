namespace Pharmacy.Core.DTO.Validators;

internal class RegexPatterns
{
    public const string Password = @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#_\-])[A-Za-z\d@$!%*?&^#_\-]{8,}$";
}