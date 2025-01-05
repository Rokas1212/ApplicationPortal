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

    [AllowAnonymous]
    [HttpGet("company")]
    public async Task<IActionResult> GetCompany([FromQuery] int companyId)
    {
        try
        {
            if (companyId <= 0)
            {
                return BadRequest(new { message = "Invalid company ID" });
            }
            
            var company = await _dbContext.Companies.FirstOrDefaultAsync(c => c.Id == companyId);
            if (company == null)
            {
                _logger.LogWarning($"Company with ID {companyId} not found.");
                return BadRequest(new { message = $"Company with the given id ({companyId}) does not exist" });
            }

            var companyResult = new FetchCompanyDto
            {
                Id = companyId,
                CompanyName = company.CompanyName,
                CompanyAddress = company.CompanyAddress,
                Description = company.Description,
                CompanyLogoUrl = company.CompanyLogoUrl,
                WebsiteUrl = company.WebsiteUrl
            };
            
            _logger.LogInformation($"Successfully fetched company with ID {companyId}.");
            return Ok(companyResult);
        }
        catch (Exception e)
        {
            _logger.LogError($"Error fetching company: {e.Message}");
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { message = "An error occured fetching the company" });
        }
    }
}