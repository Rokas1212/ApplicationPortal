using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ApplicationPortal.Models
{
    public class Company
    {
        public int Id { get; set; }
        
        [Required]
        public string CompanyName { get; set; } = string.Empty;
        
        [Required]
        public string CompanyAddress { get; set; } = string.Empty;

        public string? WebsiteUrl { get; set; } = string.Empty;
        
        public string? CompanyLogoUrl { get; set; } = string.Empty;

        // Navigation property for associated users
        public ICollection<EmployerCompany> EmployerCompanies { get; set; } = new List<EmployerCompany>();
    }
}