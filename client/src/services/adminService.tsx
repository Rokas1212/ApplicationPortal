import axios from "axios";
import {CreateUserDto} from "../pages/Admin";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = `${API_BASE_URL}/Admin`;


export const createUser = async (data: CreateUserDto): Promise<{ message: string }> => {
    try {
        const response = await axios.post(`${BASE_URL}/create-user`, data);
        return response.data; // Return success message
    } catch (error: any) {
        // Pass backend error message to the caller
        throw new Error(error.response?.data?.message || "An unexpected error occurred");
    }
};