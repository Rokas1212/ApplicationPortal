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
    
    public DbSet<Company> Companies { get; set; }
    
    public DbSet<EmployerCompany> EmployerCompanies { get; set; }
    
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // one-to-many relationship between ApplicationUser and Cv
        builder.Entity<Cv>()
            .HasOne(c => c.User) // A CV belongs to one user
            .WithMany(u => u.Cvs) // A user can have many CVs
            .HasForeignKey(c => c.UserId) // Foreign key in the Cv table
            .OnDelete(DeleteBehavior.Cascade); // Delete CVs when user is deleted
        
        // configure employerCompany as a join table
        builder.Entity<EmployerCompany>()
            .HasKey(ec => new { ec.EmployerId, ec.CompanyId });

        builder.Entity<EmployerCompany>()
            .HasOne(ec => ec.Employer)
            .WithMany(e => e.EmployerCompanies)
            .HasForeignKey(uc => uc.EmployerId);

        builder.Entity<EmployerCompany>()
            .HasOne(ec => ec.Company)
            .WithMany(c => c.EmployerCompanies)
            .HasForeignKey(ec => ec.CompanyId);
    }
}