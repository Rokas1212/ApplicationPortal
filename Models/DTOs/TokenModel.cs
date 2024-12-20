using System.ComponentModel.DataAnnotations;

namespace ApplicationPortal.Models.DTOs;

public class TokenModel
{
    [Required]
    public string AccessToken { get; set; } = string.Empty;

    [Required]
    public string RefreshToken { get; set; } = string.Empty;
}