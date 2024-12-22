using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ApplicationPortal.Models
{
    public class Employer
    {
        [Key]
        [ForeignKey("User")]
        public string Id { get; set; }

        [Required]
        [MaxLength(256)]
        public string CompanyName { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(512)]
        public string CompanyAddress { get; set; } = string.Empty;
        
        [MaxLength(256)]
        public string WebsiteUrl { get; set; } = string.Empty;

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        public ApplicationUser User { get; set; }
    }
}