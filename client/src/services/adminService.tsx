import axios from "axios";
import {AdminDtos} from "../components/interfaces/AdminDtos.tsx";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = `${API_BASE_URL}/admin`;

const token = `Bearer ${localStorage.getItem('accessToken')}`;

export const createUser = async (data: AdminDtos): Promise<{ message: string }> => {
    try {
        const response = await axios.post(`${BASE_URL}/create-user`, data , {
            headers: {
                Authorization: token
            }
        });
        return response.data; // Return success message
    } catch (error: any) {
        // Pass backend error message to the caller
        throw new Error(error.response?.data?.message || "An unexpected error occurred");
    }
};