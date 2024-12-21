using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ApplicationPortal.Models;

public class Cv
{
    [Key]
    public int Id { get; set; } // Primary Key

    [MaxLength(512)]
    [Required]
    public string CvFileUrl { get; set; } = string.Empty; // URL for the uploaded CV file

    [Required]
    public string UserId { get; set; } = string.Empty; // Foreign Key to ApplicationUser

    [ForeignKey(nameof(UserId))]
    public ApplicationUser User { get; set; } = null!; // Navigation Property
}