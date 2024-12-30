import axios from 'axios';
import {FetchCvDto, ProfileDto} from "../components/interfaces/ProfileDtos.tsx";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = `${API_BASE_URL}/Profile`;

const token = `Bearer ${localStorage.getItem('accessToken')}`;

export const getProfile = async (): Promise<ProfileDto> => {
    const response = await axios.get(`${BASE_URL}`, {
        headers: {
            Authorization: token
        }
    });
    return response.data;
}  

export const getCvs = async (): Promise<FetchCvDto[]> => {
    const response = await axios.get(`${BASE_URL}/my-cvs`, {
        headers: {
            Authorization: token
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
              Authorization: token,
              "Content-Type": "multipart/form-data",  
            },      
        }
    );
    return response.data;
}

export const deleteCv = async (id: string) => {
    return await axios.delete(
        `${BASE_URL}/delete-cv`,
        {
            params: {id},
            headers: {
                Authorization: token,
            },
        }
    ); 
}

