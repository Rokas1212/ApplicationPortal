using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;

namespace ApplicationPortal.Models.DTOs;

public class CreateCompanyDto
{
    [Required]
    public string CompanyName { get; set; } = string.Empty;
    [Required]
    public string City { get; set; } = string.Empty;
    [Required]
    public string Description { get; set; } = string.Empty;
    [Required]
    public string Country { get; set; } = string.Empty;
    [Required]
    public string Address { get; set; } = string.Empty;
    [Required]
    public string PostalCode { get; set; } = string.Empty;
    public string? WebsiteUrl { get; set; } = null;
    public IFormFile? CompanyLogo { get; set; } = null;
}