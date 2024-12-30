export interface ProfileDto {
    username: string;
    name: string;
    lastName: string;
    emailConfirmed: boolean;
    roles: string[];
}

export interface FetchCvDto {
    cvFileUrl: string;
    fileName: string;
    id: string;
}