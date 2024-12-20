import React, { useEffect, useState } from 'react';
import { getProfile, ProfileDto } from '../services/profileService';

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
        return <p>Loading...</p>;
    }

    return (
        <div style={{maxWidth: '400px', margin: 'auto', padding: '20px'}}>
            <h1>User Profile</h1>
            <p><strong>Email:</strong> {profile.username}</p>
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Last name:</strong> {profile.lastName}</p>
            {/*TODO: Implement EMAIL CONFIRMATION*/}
            <p><strong>Email Confirmed:</strong> {profile.emailConfirmed ? 'Yes' : 'No'}</p>
            <p><strong>Roles:</strong> {profile.roles.join(', ')}</p>
        </div>
    );
};


export default Profile;


