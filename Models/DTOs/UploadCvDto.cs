using System.ComponentModel.DataAnnotations;

namespace ApplicationPortal.Models.DTOs;

public class UploadCvDto
{
    [Required]
    public IFormFile? CvFile { get; set; }
    
    [MaxLength(50)]
    [Required]
    public string FileName { get; set; } = string.Empty;
}