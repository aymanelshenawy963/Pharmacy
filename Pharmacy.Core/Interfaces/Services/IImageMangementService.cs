using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.AspNetCore.Http;
namespace Pharmacy.Core.Interfaces.Services;

public interface IImageMangementService
{
    Task<List<string>> AddImageAsync(IFormFileCollection files, string src);
    void DeleteImage(string src);
}
