using System.ComponentModel.DataAnnotations;

namespace ApplicationPortal.Models.DTOs;

public class AddEmployerToCompanyDto
{
    [Required] 
    public string EmployerId { get; set; } = string.Empty;
    
    [Required]
    public int CompanyId { get; set; }
}