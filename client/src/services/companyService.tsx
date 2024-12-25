import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = `${API_BASE_URL}/Company`;

export interface FetchCompanyDto {
    id: string;
    companyName: string;
    companyAddress: string;
    websiteUrl: string;
    companyLogoUrl: string;
}

export const fetchCompanies = async (): Promise<FetchCompanyDto[]> => {
    try {
        const response = await axios.get(`${BASE_URL}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "An unexpected error occured")
    }
}