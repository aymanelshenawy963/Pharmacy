using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.AspNetCore.Http;
namespace Pharmacy.Core.Services;

public interface IImageMangementService
{
    Task<List<string>> AddImageAsync(IFormFileCollection files, string src);
    void DeleteImage(string src);
}
