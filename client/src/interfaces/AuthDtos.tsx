export interface SignupDto {
    name: string;
    lastName: string;
    email: string;
    password: string;
    receiveEmails: boolean;
}

export interface LoginDto {
    userName: string;
    password: string;
}

export interface TokenDto {
    accessToken: string;
    refreshToken: string;
}