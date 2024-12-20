using ApplicationPortal.Models;
using ApplicationPortal.Models.DTOs;
using ApplicationPortal.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

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


    public ProfileController(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, ILogger<AuthController> logger, ITokenService tokenService, AppDbContext dbContext)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _logger = logger;
        _tokenService = tokenService;
        _dbContext = dbContext;
    }

    /// <summary>
    /// Fetches profile of the user
    /// </summary>
    /// <returns>Returns the user profile data</returns>
    [HttpGet]
    public async Task<IActionResult> GetProfile()
    {
        try
        {
            var username = User?.Identity?.Name;

            if (username == null)
            {
                return Unauthorized(new { message = "User is not authenticated." });
            }
            
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

            // return profile data
            return Ok(profile);
        }
        catch (Exception e)
        {
            _logger.LogError($"Error fetching profile: {e.Message}");
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while fetching the profile." });
        }
    }
}