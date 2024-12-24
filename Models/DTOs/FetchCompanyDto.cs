using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;

namespace ApplicationPortal.Models.DTOs;

public class FetchCompanyDto
{
    [Required]
    public int Id { get; set; }

    [Required]
    public string CompanyName { get; set; }

    [Required]
    public string CompanyAddress { get; set; }

    public string? WebsiteUrl { get; set; }
    public string? CompanyLogoUrl { get; set; }
}