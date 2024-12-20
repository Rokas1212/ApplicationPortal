import axios from 'axios';

const BASE_URL = 'http://localhost:5021/api/Profile';

export interface ProfileDto {
    username: string;
    name: string;
    lastname: string;
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