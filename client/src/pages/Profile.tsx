import React, { useEffect, useState } from 'react';
import { getProfile, ProfileDto } from '../services/profileService';
import UploadCv from "../components/UploadCv.tsx";
import UserInfo from "../components/UserInfo.tsx";
import Loading from "../components/Loading.tsx";

const Profile: React.FC = () => {
    const [profile, setProfile] = useState<ProfileDto | null>(null);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const fetchProfile = async () => {
          try {
              const data = await getProfile();
              setProfile(data);
              setError(null);
          }  catch (err: any) {
              setError(err.response?.data?.message || 'Failed to fetch user profile')
          }
        };
        fetchProfile();
    }, []);
    
    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }
    
    if(!profile) {
        return <Loading/>;
    }

    return (
        <div className="container mt-5">
            <UserInfo profile={profile} />
            <UploadCv/>
        </div>
    );
};


export default Profile;


