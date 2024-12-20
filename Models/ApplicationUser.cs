using System.ComponentModel.DataAnnotations;
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

}