using System.ComponentModel.DataAnnotations;
using ApplicationPortal.Constants;

namespace ApplicationPortal.Models.DTOs;

public class CreateUserDto
{
    [Required]
    [MaxLength(50)]
    public string Name { get; set; } = string.Empty;
    [Required]
    [MaxLength(50)]
    public string LastName { get; set; } = string.Empty;
    [Required]
    [MaxLength(30)]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    [Required]
    [MaxLength(30)]
    public string Password { get; set; } = string.Empty;

    [Required]
    public string Role { get; set; } = Roles.JobSeeker;
}