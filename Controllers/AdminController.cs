using ApplicationPortal.Constants;
using ApplicationPortal.Models;
using ApplicationPortal.Models.DTOs;
using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ApplicationPortal.Controllers;

[ApiController]
[Authorize(Roles=Roles.Admin)]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _dbContext;
    private readonly ILogger<AdminController> _logger;
    private readonly BlobServiceClient _blobServiceClient;
    private readonly IConfiguration _configuration;
    private readonly string? _containerName;

    public AdminController(AppDbContext dbContext, ILogger<AdminController> logger, BlobServiceClient blobServiceClient, IConfiguration configuration)
    {
        _dbContext = dbContext;
        _logger = logger;
        _blobServiceClient = blobServiceClient;
        _configuration = configuration;
        _containerName = _configuration["AzureBlobStorage:LogoContainer"];
    }

    [HttpPost("create-company")]
     public async Task<IActionResult> CreateCompany([FromForm] CreateCompanyDto dto)
     {
        try
        {
            // Check if a company with the same name already exists
            var existingCompany = await _dbContext.Companies.FirstOrDefaultAsync(c => c.CompanyName == dto.CompanyName);
            if (existingCompany != null)
            {
                return BadRequest(new { message = "A company with this name already exists." });
            }

            // Prepare blob storage client
            var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
            await containerClient.CreateIfNotExistsAsync();

            string logoUrl = null;

            if (dto.CompanyLogo != null)
            {
                // Validate file extension
                var allowedExtensions = new[] { ".jpg", ".png", ".jpeg" };
                var fileExtension = Path.GetExtension(dto.CompanyLogo.FileName);
                if (!allowedExtensions.Contains(fileExtension, StringComparer.OrdinalIgnoreCase))
                {
                    return BadRequest(new { message = "Unsupported file type. Allowed: .jpg, .png, .jpeg" });
                }

                // Generate unique file name and upload
                var uniqueFileName = $"{dto.CompanyName}/Logo{fileExtension}";
                var blobClient = containerClient.GetBlobClient(uniqueFileName);

                await using var stream = dto.CompanyLogo.OpenReadStream();
                await blobClient.UploadAsync(stream, overwrite: true);

                // Set logo URL
                logoUrl = blobClient.Uri.ToString();
            }

            // Create company object
            var company = new Company
            {
                CompanyName = dto.CompanyName,
                CompanyAddress = $"{dto.Address}, {dto.City}, {dto.PostalCode}, {dto.Country}",
                CompanyLogoUrl = logoUrl,
                WebsiteUrl = dto.WebsiteUrl
            };

            // Save to database
            await _dbContext.Companies.AddAsync(company);
            await _dbContext.SaveChangesAsync();

            // Return success response
            return Ok(new { message = "Company created successfully.", companyId = company.Id });
        }
        catch (Exception e)
        {
            _logger.LogError($"Error creating company: {e}");
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while creating the company." });
        }
     }
}