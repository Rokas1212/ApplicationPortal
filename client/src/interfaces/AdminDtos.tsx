export enum Roles {
    Admin = "Admin",
    JobSeeker = "Job Seeker",
    Employer = "Employer",
}

export interface CreateUserDto {
    name: string;
    lastName: string;
    email: string;
    password: string;
    role: Roles;
}