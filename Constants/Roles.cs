namespace ApplicationPortal.Constants;

public class Roles
{
    public const string Admin = "Admin";
    public const string JobSeeker = "Job Seeker";
    public const string Employer = "Employer";
    
    public static readonly List<string> AllRoles = new()
    {
        Admin,
        JobSeeker,
        Employer
    };
}