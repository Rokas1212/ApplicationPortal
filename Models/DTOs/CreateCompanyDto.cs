using Microsoft.AspNetCore.Mvc;

namespace ApplicationPortal.Models.DTOs;

public class CreateCompanyDto
{
    public string CompanyName { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;
    public string? WebsiteUrl { get; set; } = null;
    public IFormFile? CompanyLogo { get; set; } = null;
}