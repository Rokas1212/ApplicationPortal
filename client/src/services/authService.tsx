import axios from 'axios';

const BASE_URL = 'http://localhost:5021/api';

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

export const signup = async (data: SignupDto): Promise<{ message: string }> => {
    try {
        const response = await axios.post(`${BASE_URL}/Auth/signup`, data);
        return response.data; // Return success message
    } catch (error: any) {
        // Pass backend error message to the caller
        throw new Error(error.response?.data?.message || "An unexpected error occurred");
    }
};

export const login = async (data: LoginDto): Promise<TokenDto> => {
    const response = await axios.post(`${BASE_URL}/Auth/login`, data);
    // returns tokens
    return response.data;
};