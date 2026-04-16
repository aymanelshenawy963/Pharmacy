using Pharmacy.Core.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.FileProviders;


namespace Pharmacy.Infrastructure.Repositriers.Service;

public class ImageMangementService : IImageMangementService
{
    private readonly IFileProvider fileProvider;
    public ImageMangementService(IFileProvider fileProvider)
    {
     this.fileProvider = fileProvider;
    }
    public async Task<List<string>> AddImageAsync(IFormFileCollection files, string src)
    {
        List<string> savedImages = new();

        var imageDirectory = Path.Combine("wwwroot", "Images", src);

        if (!Directory.Exists(imageDirectory))
            Directory.CreateDirectory(imageDirectory);

        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png","webp" };

        foreach (var file in files)
        {
            if (file.Length > 0)
            {
                var extension = Path.GetExtension(file.FileName).ToLower();

                if (!allowedExtensions.Contains(extension))
                    throw new Exception("Invalid image format");

                var imageName = Guid.NewGuid() + extension;

                var imagePath = $"/Images/{src}/{imageName}";
                var filePath = Path.Combine(imageDirectory, imageName);

                using var stream = new FileStream(filePath, FileMode.Create);
                await file.CopyToAsync(stream);

                savedImages.Add(imagePath);
            }
        }

        return savedImages;
    }

    public void DeleteImage(string src)
    {
        var info = fileProvider.GetFileInfo(src);

        var root = info.PhysicalPath;

        if (File.Exists(root))
        {
            File.Delete(root);
        }
    }
}
