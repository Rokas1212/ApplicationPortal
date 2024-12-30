import axios from 'axios';
import {LoginDto, SignupDto, TokenDto} from "../components/interfaces/AuthDtos.tsx";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = `${API_BASE_URL}/Auth`;

export const signup = async (data: SignupDto): Promise<{ message: string }> => {
    try {
        const response = await axios.post(`${BASE_URL}/signup`, data);
        return response.data; // Return success message
    } catch (error: any) {
        // Pass backend error message to the caller
        throw new Error(error.response?.data?.message || "An unexpected error occurred");
    }
};

export const login = async (data: LoginDto): Promise<TokenDto> => {
    const response = await axios.post(`${BASE_URL}/login`, data);
    // returns tokens
    return response.data;
};