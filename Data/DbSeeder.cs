using ApplicationPortal.Constants;
using ApplicationPortal.Models;
using Microsoft.AspNetCore.Identity;

namespace ApplicationPortal.Data;

public class DbSeeder
{
    public static async Task SeedData(IApplicationBuilder app)
    {
        // Scoped service provider to resolve dependencies
        using var scope = app.ApplicationServices.CreateScope();
        
        // resolve logger service
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<DbSeeder>>();

        try
        {
            // resolve other dependencies
            var userManager = scope.ServiceProvider.GetService<UserManager<ApplicationUser>>();
            var roleManager = scope.ServiceProvider.GetService<RoleManager<IdentityRole>>();

            // check if users exist
            if (userManager.Users.Any() == false)
            {
                var user = new ApplicationUser()
                {
                    Name = "Super",
                    UserName = "rokas.roktantu@gmail.com",
                    Email = "rokas.roktantu@gmail.com",
                    EmailConfirmed = true,
                    SecurityStamp = Guid.NewGuid().ToString()
                };

                // create admin if it doesn't exist
                if ((await roleManager.RoleExistsAsync(Roles.Admin)) == false)
                {
                    logger.LogInformation("Creating Admin Role.");
                    var roleResult = await roleManager.CreateAsync(new IdentityRole(Roles.Admin));

                    if (!roleResult.Succeeded)
                    {
                        var roleErrors = roleResult.Errors.Select(e => e.Description);
                        logger.LogError($"Failed to create admin role. Errors: {string.Join(",", roleErrors)}");

                        return;
                    }

                    logger.LogInformation("Admin Role Created.");
                }

                logger.LogInformation("Creating User.");
                var createUserResult = await userManager.CreateAsync(user: user, password: "S@fePassword123!");

                //Check if user was created
                if (!createUserResult.Succeeded)
                {
                    var errors = createUserResult.Errors.Select(e => e.Description);
                    logger.LogError($"Failed to create user. Errors: {string.Join(",", errors)}");

                    return;
                }

                logger.LogInformation("Created User.");

                logger.LogInformation("Assigning Admin Role To User.");
                var userAddRoleResult = await userManager.AddToRoleAsync(user, Roles.Admin);
                // Check if role was assigned
                if (!userAddRoleResult.Succeeded)
                {
                    var addRoleErrors = userAddRoleResult.Errors.Select(e => e.Description);
                    logger.LogError($"Failed to assign admin role. Errors: {string.Join(",", addRoleErrors)}");
                }
                logger.LogInformation("Admin Role Assigned.");
            }

        }
        catch (Exception exception)
        {
            logger.LogCritical(exception.Message);
        }
    }
}