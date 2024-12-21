using System.Security.Claims;
using ApplicationPortal.Constants;
using ApplicationPortal.Models;
using ApplicationPortal.Models.DTOs;
using ApplicationPortal.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.JsonWebTokens;

namespace ApplicationPortal.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly ILogger<AuthController> _logger;
    private readonly ITokenService _tokenService;
    private readonly AppDbContext _dbContext;

    public AuthController(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, ILogger<AuthController> logger, ITokenService tokenService, AppDbContext dbContext)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _logger = logger;
        _tokenService = tokenService;
        _dbContext = dbContext;
    }

    /// <summary>
    /// Registers a new user.
    /// </summary>
    /// <param name="dto">The signup request data.</param>
    /// <returns>Returns a success message.</returns>
    [HttpPost("signup")]
    public async Task<IActionResult> Signup([FromBody] SignupDto dto)
    {
        try
        {
            var existingUser = await _userManager.FindByNameAsync(dto.Email);
            if (existingUser != null)
            {
                return BadRequest(new { message = "User Already Exists" });
            }
            
            // Create Job Seeker Role If It Doesn't Exist
            if ((await _roleManager.RoleExistsAsync(Roles.JobSeeker)) == false)
            {
                var roleResult = await _roleManager
                                        .CreateAsync(new IdentityRole(Roles.JobSeeker));
                if (roleResult.Succeeded == false)
                {
                    var roleErrors = roleResult.Errors.Select(e => e.Description);
                    var message = $"Failed to create {Roles.JobSeeker} Role. Errors: {string.Join(",", roleErrors)}";
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
            var addRoleToUserResult = await _userManager.AddToRoleAsync(user: user, role: Roles.JobSeeker);

            // Check if role added to user
            if (addRoleToUserResult.Succeeded == false)
            {
                var errors = addRoleToUserResult.Errors.Select(e => e.Description);
                var message = $"Could not add {Roles.JobSeeker} role to user. Errors: {String.Join(",", errors)}";
                return BadRequest(message);
            }

            return CreatedAtAction(nameof(Signup), new {message = $"User with this username: {user.UserName} created successfully"});
        }
        catch (Exception ex)
        {
            _logger.LogCritical(ex.Message);
            return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
        }
    }

    /// <summary>
    /// Logs a user in
    /// </summary>
    /// <param name="dto">The login request data.</param>
    /// <returns>Returns a success message.</returns>
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        try
        {
            var user = await _userManager.FindByNameAsync(dto.Username);
            if (user == null)
            {
                return BadRequest("This account does not exist");
            }

            bool isValidPassword = await _userManager.CheckPasswordAsync(user, dto.Password);
            if (!isValidPassword)
            {
                return Unauthorized();
            }
            
            // create claims
            List<Claim> authClaims = [
                new (ClaimTypes.Name, user.UserName),
                new (JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            ];

            var userRoles = await _userManager.GetRolesAsync(user);
            
            // add roles to claim
            foreach (var userRole in userRoles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, userRole));
            }
            
            // generating access token
            var token = _tokenService.GenerateAccessToken(authClaims);
            
            // generating refresh token
            string refreshToken = _tokenService.GenerateRefreshToken();
            
            // save refresh token in db
            var tokenInfo = _dbContext.TokenInfos.FirstOrDefault(a => a.Username == user.UserName);
            
            // if token is null create a new one, else create a new one
            if (tokenInfo == null)
            {
                var tInfo = new TokenInfo()
                {
                    Username = user.UserName,
                    RefreshToken = refreshToken,
                    ExpiredAt = DateTime.UtcNow.AddDays(7)
                };
                _dbContext.TokenInfos.Add(tInfo);
            }
            else
            {
                tokenInfo.RefreshToken = refreshToken;
                tokenInfo.ExpiredAt = DateTime.UtcNow.AddDays(7);
            }

            await _dbContext.SaveChangesAsync();

            return Ok(new TokenDto()
            {
                AccessToken = token,
                RefreshToken = refreshToken
            });

        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return Unauthorized();
        }
    }

    [HttpPost("token/refresh")]
    public async Task<IActionResult> Refresh(TokenDto dto)
    {
        try
        {
            var principal = _tokenService.GetPrincipalFromExpiredToken(dto.AccessToken);
            var username = principal.Identity?.Name;

            var tokenInfo = _dbContext.TokenInfos.SingleOrDefault(u => u.Username == username);
            if (tokenInfo == null || tokenInfo.RefreshToken != dto.RefreshToken || tokenInfo.ExpiredAt <= DateTime.UtcNow)
            {
                return BadRequest("Invalid Refresh Token");
            }

            var newAccessToken = _tokenService.GenerateAccessToken(principal.Claims);
            var newRefreshToken = _tokenService.GenerateRefreshToken();

            tokenInfo.RefreshToken = newRefreshToken;
            await _dbContext.SaveChangesAsync();

            return Ok(new TokenDto
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken
            });
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }
    
    [HttpPost("token/revoke")]
    [Authorize]
    public async Task<IActionResult> Revoke()
    {
        try
        {
            var username = User.Identity.Name;

            var user = _dbContext.TokenInfos.SingleOrDefault(u => u.Username == username);
            if (user == null)
            {
                return BadRequest();
            }

            user.RefreshToken = string.Empty;
            await _dbContext.SaveChangesAsync();

            return Ok(true);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex.Message);
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }
}