using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Pharmacy.API.Helpers;

namespace Ecom.Api.Controllers;

[Route("errors/{statusCode}")]
[ApiController]
public class ErrorController : ControllerBase
{
    [HttpGet]
    public IActionResult Error(int statusCode)
    {
        return new ObjectResult(new ResponseAPI(statusCode));
    }
}
