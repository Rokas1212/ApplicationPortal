using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace ApplicationPortal.Models.DTOs;

public class ProfileDto
{
    [Required] public string Username { get; set; } = string.Empty;
    [Required] public string Name { get; set; } = string.Empty;
    [Required] public string LastName { get; set; } = string.Empty;
    [Required] public Boolean EmailConfirmed { get; set; }
    [Required] public IEnumerable<string> Roles { get; set; }
}