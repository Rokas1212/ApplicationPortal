using System.ComponentModel.DataAnnotations;

namespace ApplicationPortal.Models.DTOs;

public class ProfileModel
{
    [Required] public string Username { get; set; } = string.Empty;
    [Required] public string Name { get; set; } = string.Empty;
    [Required] public string LastName { get; set; } = string.Empty;
}