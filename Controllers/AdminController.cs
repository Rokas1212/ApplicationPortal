using ApplicationPortal.Constants;
using ApplicationPortal.Models;
using ApplicationPortal.Models.DTOs;
using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
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
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;

    public AdminController(AppDbContext dbContext, ILogger<AdminController> logger, BlobServiceClient blobServiceClient, IConfiguration configuration,
                           UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
    {
        _dbContext = dbContext;
        _logger = logger;
        _blobServiceClient = blobServiceClient;
        _configuration = configuration;
        _containerName = _configuration["AzureBlobStorage:LogoContainer"];
        _userManager = userManager;
        _roleManager = roleManager;
    }

    [HttpPost("create-user")]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserDto dto)
    {
        try
        {
            var existingUser = await _userManager.FindByNameAsync(dto.Email);
            if (existingUser != null)
            {
                return BadRequest(new { message = "User Already Exists" });
            }
            
            // Check if role should exist
            if (!Roles.AllRoles.Contains(dto.Role))
            {
                return BadRequest(new { message = $"Invalid role: {dto.Role}" });
            }
            
            // Create Role If It Doesn't Exist
            if (!await _roleManager.RoleExistsAsync(dto.Role))
            {
                var roleResult = await _roleManager
                                        .CreateAsync(new IdentityRole(dto.Role));
                if (roleResult.Succeeded == false)
                {
                    var roleErrors = roleResult.Errors.Select(e => e.Description);
                    var message = $"Failed to create {dto.Role} Role. Errors: {string.Join(",", roleErrors)}";
                    _logger.LogError(message);
                    return BadRequest(message);
                }
            }

            ApplicationUser user = new()
            {
                Email = dto.Email,
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = dto.Email,
                Name = dto.Name,
                LastName = dto.LastName,
                // TODO Implement email validation
                EmailConfirmed = true
            };
            
            // Create User
            var createUserResult = await _userManager.CreateAsync(user, dto.Password);
            
            // Check User Creation Result
            if (createUserResult.Succeeded == false)
            {
                var errors = createUserResult.Errors.Select(e => e.Description);
                var message = $"Failed to create user. Errors: {string.Join(",", errors)}";
                _logger.LogError(message);
                return BadRequest(message);
            }
            
            // Adding role to user
            var addRoleToUserResult = await _userManager.AddToRoleAsync(user: user, role: dto.Role);

            // Check if role added to user
            if (addRoleToUserResult.Succeeded == false)
            {
                var errors = addRoleToUserResult.Errors.Select(e => e.Description);
                var message = $"Could not add {dto.Role} role to user. Errors: {String.Join(",", errors)}";
                return BadRequest(message);
            }

            return CreatedAtAction(nameof(CreateUser), new {message = $"User with this username: {user.UserName} created successfully"});
        }
        catch (Exception ex)
        {
            _logger.LogCritical(ex.Message);
            return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
        }
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
                WebsiteUrl = dto.WebsiteUrl,
                Description = dto.Description
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

    [HttpPost("add-employer-to-company")]
    public async Task<IActionResult> AddEmployerToCompany(AddEmployerToCompanyDto dto)
    {
        try
        {
            var employerRole = await _dbContext.Roles
                .Where(r => r.Name == "Employer")
                .Select(r => r.Id)
                .FirstOrDefaultAsync();
            
            var existingEmployer =
                await _dbContext.UserRoles.FirstOrDefaultAsync(ur =>
                    ur.UserId == dto.EmployerId && ur.RoleId.Equals(employerRole));
            if (existingEmployer == null)
            {
                return BadRequest(new { message = "This employer does not exist." });
            }
            
            var existingCompany = await _dbContext.Companies.FirstOrDefaultAsync(c => c.Id == dto.CompanyId);
            if (existingCompany == null)
            {
                return BadRequest(new { message = "A company with this ID does not exist." });
            }

            var duplicateEmployer = await _dbContext.EmployerCompanies.FirstOrDefaultAsync(ec =>
                ec.EmployerId == dto.EmployerId && ec.CompanyId == dto.CompanyId);
            if (duplicateEmployer != null)
            {
                return BadRequest(new
                    { message = $"The employer {dto.EmployerId} is already assigned to company {dto.CompanyId}" });
            }

            var employerCompany = new EmployerCompany
            {
                CompanyId = dto.CompanyId,
                EmployerId = dto.EmployerId
            };
            
            // Save to database
            await _dbContext.EmployerCompanies.AddAsync(employerCompany);
            await _dbContext.SaveChangesAsync();

            return Ok(new { message = "Employer successfully assigned to a company" });
        }
        catch (Exception e)
        {
            _logger.LogError($"Error assigning employer to a company: {e}");
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while assigning employer to the company." });
        }
    }
}