import React, { useEffect, useState } from 'react';
import {getProfile, ProfileDto} from '../services/profileService';
import UploadCv from "../components/UploadCv.tsx";
import UserInfo from "../components/UserInfo.tsx";
import Loading from "../components/Loading.tsx";
import UserCvs from "../components/UserCvs.tsx";

const Profile: React.FC = () => {
    const [profile, setProfile] = useState<ProfileDto | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [reloadFlag, setReloadFlag] = useState(false);
    
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

    const triggerReload = () => {
        setReloadFlag(prev => !prev);
    };
    
    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }
    
    if(!profile) {
        return <Loading/>;
    }

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-6">
                    <UserInfo profile={profile}/>
                </div>
                <div className="col-md-6">
                    <UserCvs reloadFlag={reloadFlag} />
                </div>
            </div>
            <hr/>
            <div className="row">
                <div className="col-md-6">
                    <UploadCv onUploadSuccess={triggerReload}/>
                </div>
            </div>
        </div>
    );
};


export default Profile;


