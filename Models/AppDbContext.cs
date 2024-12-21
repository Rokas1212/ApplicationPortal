using ApplicationPortal.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ApplicationPortal.Models;

public class AppDbContext : IdentityDbContext<ApplicationUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {}
    
    public DbSet<TokenInfo> TokenInfos { get; set; }
    public DbSet<Cv> Cvs { get; set; }
    
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // one-to-many relationship between ApplicationUser and Cv
        builder.Entity<Cv>()
            .HasOne(c => c.User) // A CV belongs to one user
            .WithMany(u => u.Cvs) // A user can have many CVs
            .HasForeignKey(c => c.UserId) // Foreign key in the Cv table
            .OnDelete(DeleteBehavior.Cascade); // Delete CVs when user is deleted
    }
}