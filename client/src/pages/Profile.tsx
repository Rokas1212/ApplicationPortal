import React, { useEffect, useState } from 'react';
import {getProfile, ProfileDto, FetchCvDto, getCvs} from '../services/profileService';
import UploadCv from "../components/UploadCv.tsx";
import UserInfo from "../components/UserInfo.tsx";
import Loading from "../components/Loading.tsx";
import UserCvs from "../components/UserCvs.tsx";

const Profile: React.FC = () => {
    const [profile, setProfile] = useState<ProfileDto | null>(null);
    const [cvs, setCvs] = useState<FetchCvDto[] | null>(null);
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
        
        const fetchCvs = async () => {
            try{
                const data = await getCvs();
                setCvs(data);
                setError(null);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to fetch CVS')
            }
        }
        fetchProfile();
        fetchCvs();
    }, []);
    
    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }
    
    if(!profile || !cvs) {
        return <Loading/>;
    }

    return (
        <div className="container mt-5">
            <UserInfo profile={profile}/>
            <hr/>
            <UserCvs cvs={cvs}/>
            <hr/>
            <UploadCv/>
        </div>
    );
};


export default Profile;


