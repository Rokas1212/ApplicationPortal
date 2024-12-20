using System.ComponentModel.DataAnnotations;

namespace ApplicationPortal.Models.DTOs;

public class LoginModel
{
    [Required] public string Username { get; set; } = string.Empty;
    [Required] public string Password { get; set; } = string.Empty;
}