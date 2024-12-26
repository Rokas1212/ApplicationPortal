using ApplicationPortal.Models;
using ApplicationPortal.Models.DTOs;
using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ApplicationPortal.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CompanyController : ControllerBase
{
    private readonly AppDbContext _dbContext;
    private readonly ILogger<CompanyController> _logger;

    public CompanyController(AppDbContext dbContext, ILogger<CompanyController> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    [AllowAnonymous]
    [HttpGet]
    public async Task<IActionResult> GetCompanies()
    {
        try
        {
            var companies = await _dbContext.Companies
                .Select(c => new FetchCompanyDto
                {
                    Id = c.Id,
                    CompanyName = c.CompanyName,
                    CompanyAddress = c.CompanyAddress,
                    CompanyLogoUrl = c.CompanyLogoUrl,
                    WebsiteUrl = c.WebsiteUrl,
                    Description = c.Description
                    
                })
                .ToListAsync();

            return Ok(companies);
        }
        catch (Exception e)
        {
            _logger.LogError($"Error fetching companies: {e.Message}");
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { message = "An error occured fetching companies" });
        }
    }
}