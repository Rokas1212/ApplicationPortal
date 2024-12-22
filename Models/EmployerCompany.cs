using System.ComponentModel.DataAnnotations.Schema;

namespace ApplicationPortal.Models;

public class EmployerCompany
{
    [ForeignKey(nameof(Employer))]
    public string EmployerId { get; set; }
    public ApplicationUser Employer { get; set; }

    [ForeignKey(nameof(Company))]
    public int CompanyId { get; set; }
    public Company Company { get; set; }
}