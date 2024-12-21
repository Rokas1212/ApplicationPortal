import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = `${API_BASE_URL}/Profile`;

export interface ProfileDto {
    username: string;
    name: string;
    lastName: string;
    emailConfirmed: boolean;
    roles: string[];
}

export const getProfile = async (): Promise<ProfileDto> => {
    const response = await axios.get(`${BASE_URL}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
    return response.data;
}  

export const uploadCv = async (formData: FormData) => {
    const response = await axios.post(
        `${BASE_URL}/cv-upload`,
        formData,
        {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              "Content-Type": "multipart/form-data",  
            },      
        }
    );
    return response.data;
}