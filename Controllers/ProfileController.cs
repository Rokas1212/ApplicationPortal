using System.Collections.Immutable;
using ApplicationPortal.Constants;
using ApplicationPortal.Models;
using ApplicationPortal.Models.DTOs;
using ApplicationPortal.Services;
using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace ApplicationPortal.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ProfileController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly ILogger<AuthController> _logger;
    private readonly ITokenService _tokenService;
    private readonly AppDbContext _dbContext;
    private readonly BlobServiceClient _blobServiceClient;
    private readonly string? _containerName;
    private readonly IConfiguration _configuration;

    public ProfileController(UserManager<ApplicationUser> userManager, 
                            RoleManager<IdentityRole> roleManager, 
                            ILogger<AuthController> logger,
                            ITokenService tokenService, 
                            AppDbContext dbContext, 
                            BlobServiceClient blobServiceClient, 
                            IConfiguration configuration)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _logger = logger;
        _tokenService = tokenService;
        _dbContext = dbContext;
        _blobServiceClient = blobServiceClient;
        _configuration = configuration;
        _containerName = _configuration["AzureBlobStorage:ContainerName"]; 
    }

    /// <summary>
    /// Fetches profile of the user
    /// </summary>
    /// <returns>Returns the user profile data</returns>
    [HttpGet]
    [Authorize(Roles = Roles.JobSeeker)]
    public async Task<IActionResult> GetProfile()
    {
        try
        {
            var username = User?.Identity?.Name;
            
            // Fetch user details from the database
            var user = await _userManager.FindByNameAsync(username);

            if (user == null)
            {
                return NotFound(new { message = "User profile not found." });
            }
            
            // Map the user data to a DTO or response object
            var profile = new ProfileDto()
            {
                Name = user.Name,
                LastName = user.LastName,
                Username = user.Email,
                Roles = await _userManager.GetRolesAsync(user), // Fetch user roles
                EmailConfirmed = user.EmailConfirmed
            };
            
            _logger.LogInformation($"Container Name: {_containerName}");
            // return profile data
            return Ok(profile);
        }
        catch (Exception e)
        {
            _logger.LogError($"Error fetching profile: {e.Message}");
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while fetching the profile." });
        }
    }

    /// <summary>
    /// Uploads PDF file (CV) to Azure Blob
    /// </summary>
    /// <returns>Success message and CV URI</returns>
    [HttpPost("cv-upload")]
    [Authorize(Roles = Roles.JobSeeker)]
    public async Task<IActionResult> UploadCv([FromForm] UploadCvDto cvDto)
    {
        try
        {
            var username = User?.Identity?.Name;
            // Validate the file
            if (cvDto.CvFile == null || cvDto.CvFile.Length == 0)
            {
                return BadRequest(new { message = "Invalid file. Please upload a valid CV." });
            }
            
            // Validate the file extension
            if (Path.GetExtension(cvDto.CvFile.FileName).ToLower() != ".pdf")
            {
                return BadRequest(new { message = "Invalid file type. Please upload a PDF file." });
            }
            
            var user = await _userManager.FindByNameAsync(username);
            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }
            
            var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
            await containerClient.CreateIfNotExistsAsync();
            
            var uniqueFileName = $"{username}/CV_{Guid.NewGuid()}{Path.GetExtension(cvDto.CvFile.FileName)}";
            var blobClient = containerClient.GetBlobClient(uniqueFileName);
            
            await using var stream = cvDto.CvFile.OpenReadStream();
            await blobClient.UploadAsync(stream, overwrite: true);

            var cv = new Cv
            {
                CvFileUrl = blobClient.Uri.ToString(),
                UserId = user.Id,
                FileName = cvDto.FileName
            };
            _dbContext.Cvs.Add(cv);
            await _dbContext.SaveChangesAsync();
            
            return Ok(new { message = "CV uploaded successfully.", fileUrl = blobClient.Uri });
        }
        catch (Exception e)
        {
            _logger.LogError($"Error uploading CV: {e.Message}");
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while uploading the CV." });
        }
    }

    [HttpGet("my-cvs")]
    [Authorize(Roles = Roles.JobSeeker)]
    public async Task<IActionResult> GetCvs()
    {
        try
        {
            var username = User?.Identity?.Name;
            var user = await _dbContext.Users
                .Include(u => u.Cvs)
                .FirstOrDefaultAsync(u => u.UserName == username);
            
            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }
            
            var cvs = user.Cvs.Select(cv => new FetchCvDto
            {
                CvFileUrl = cv.CvFileUrl,
                FileName = cv.FileName,
                Id = cv.Id
            }).ToList();

            return Ok(cvs);
        }
        catch (Exception e)
        {
            _logger.LogError($"Error fetching CVS: {e.Message}");
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while fetching your CVS." });
        }
    }

    [Authorize(Roles = Roles.Admin + "," + Roles.JobSeeker)]
    [HttpDelete("delete-cv")]
    public async Task<IActionResult> DeleteCv([FromQuery] int id)
    {
        try
        {
            var username = User.Identity?.Name;
            var user = await _userManager.FindByNameAsync(username);
            var cv = _dbContext.Cvs.FirstOrDefault(cv => cv.Id == id);

            if (cv == null)
            {
                return NotFound(new { message = "CV with the given ID does not exist." });
            }

            if (cv.UserId != user?.Id && !User.IsInRole(Roles.Admin))
            {
                return Unauthorized("You can not delete this CV.");
            }
            
            var containerName = "cv-uploads";
            
            // Initialize the BlobClient to delete the file from Azure Blob Storage
            var blobContainerClient = _blobServiceClient.GetBlobContainerClient(containerName);
            
            // Extract the URI
            var uri = new Uri(cv.CvFileUrl);

            // Decode the path and remove the leading '/'
            var decodedPath = Uri.UnescapeDataString(uri.AbsolutePath.Substring(1));

            // Remove the container name to get the relative blob name
            var blobName = decodedPath.Substring(containerName.Length + 1);

            // Get the BlobClient
            var blobClient = blobContainerClient.GetBlobClient(blobName);

            // Delete the blob
            await blobClient.DeleteIfExistsAsync();
            
            _dbContext.Cvs.Remove(cv);
            await _dbContext.SaveChangesAsync();

            return Ok(new { message = "CV deleted successfully." });
        }
        catch (Exception e)
        {
            _logger.LogError($"Error deleting CV: {e.Message}");
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while deleting your CV." });
        }
    }
    
    
    // helpers
    
    // method to fetch CV using ID
    private Cv getCvById(int id)
    {
        var cv = _dbContext.Cvs.FirstOrDefault(cv => cv.Id == id);
        return cv;
    }
}