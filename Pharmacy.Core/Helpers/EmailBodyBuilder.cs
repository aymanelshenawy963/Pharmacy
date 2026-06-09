namespace Pharmacy.Core.Helpers;

public static class EmailBodyBuilder
{
    public static string GenerateEmailBody(string template,Dictionary<string,string> templlateModel)
    {
        var templatePath = $"{AppDomain.CurrentDomain.BaseDirectory}/Templates/{template}.html";
        var streamReader = new StreamReader(templatePath);
        var body = streamReader.ReadToEnd();
        streamReader.Close();


        foreach (var item in templlateModel)
        {
            body = body.Replace(item.Key ,item.Value);
        }

        return body;
    }

}
