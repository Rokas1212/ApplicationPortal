using System.Collections.Immutable;
using ApplicationPortal.Constants;
using ApplicationPortal.Models;
using ApplicationPortal.Models.DTOs;
using ApplicationPortal.Services;
using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
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
            var profile = new ProfileModel()
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

    [HttpPost("cv-upload")]
    [Authorize(Roles = Roles.JobSeeker)]
    public async Task<IActionResult> UploadCv([FromForm] IFormFile? cvFile)
    {
        try
        {
            var username = User?.Identity?.Name;
            // Validate the file
            if (cvFile == null || cvFile.Length == 0)
            {
                return BadRequest(new { message = "Invalid file. Please upload a valid CV." });
            }
            
            // Validate the file extension
            if (Path.GetExtension(cvFile.FileName).ToLower() != ".pdf")
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
            
            var uniqueFileName = $"{username}/CV_{Guid.NewGuid()}{Path.GetExtension(cvFile.FileName)}";
            var blobClient = containerClient.GetBlobClient(uniqueFileName);
            
            await using var stream = cvFile.OpenReadStream();
            await blobClient.UploadAsync(stream, overwrite: true);

            var cv = new Cv
            {
                CvFileUrl = blobClient.Uri.ToString(),
                UserId = user.Id
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
    
}