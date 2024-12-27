using System.ComponentModel.DataAnnotations;

namespace ApplicationPortal.Models.DTOs;

public enum RolesEnum
{
    Admin,
    JobSeeker,
    Employer
}

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
    public RolesEnum Role { get; set; }
}