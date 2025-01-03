using System.ComponentModel.DataAnnotations;
using System.Runtime.InteropServices;
using ApplicationPortal.Constants;
using Microsoft.AspNetCore.Identity;

namespace ApplicationPortal.Models;

public class ApplicationUser : IdentityUser
{
    [Required]
    [MaxLength(50)]
    public string Name { get; set; } = String.Empty;

    [Required]
    [MaxLength(50)]
    public string LastName { get; set; } = String.Empty;

    [Required]
    public Boolean ReceiveEmails { get; set; } = false;

    // Navigation properties
    public ICollection<Cv> Cvs { get; set; } = new List<Cv>();
    
    public ICollection<EmployerCompany> EmployerCompanies { get; set; } = new List<EmployerCompany>();
}