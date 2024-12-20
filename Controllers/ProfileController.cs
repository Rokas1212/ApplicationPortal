using ApplicationPortal.Models;
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
                return Unauthorized();
            }
            
            var user = _userManager.FindByNameAsync(username);
            
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }
}