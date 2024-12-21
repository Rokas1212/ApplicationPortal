using System.ComponentModel.DataAnnotations;

namespace ApplicationPortal.Models.DTOs;

public class FetchCvDto
{
    [Required]
    public string CvFileUrl { get; set; } = string.Empty;
    [Required]
    public string FileName { get; set; } = string.Empty;
}