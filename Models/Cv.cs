using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ApplicationPortal.Models;

public class Cv
{
    [Key]
    public int Id { get; set; } // Primary Key

    [MaxLength(50)]
    [Required]
    public string FileName { get; set; } = string.Empty; // Name for the CV file

    [MaxLength(512)]
    [Required]
    public string CvFileUrl { get; set; } = string.Empty; // URL for the uploaded CV file

    [MaxLength(512)]
    [Required]
    public string ContainerPath { get; set; } = string.Empty; // Path for later use deleting the CV from Azure 
        
    [Required]
    public string UserId { get; set; } = string.Empty; // Foreign Key to ApplicationUser

    [ForeignKey(nameof(UserId))]
    public ApplicationUser User { get; set; } = null!; // Navigation Property
}