import React, { useEffect, useState } from 'react';
import { getProfile, ProfileDto } from '../services/profileService';
import UploadCv from "../components/UploadCv.tsx";

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
        return (
            <div className="d-flex justify-content-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="card shadow">
                <div className="card-header bg-primary text-white">
                    <h1 className="h3 mb-0">User Profile</h1>
                </div>
                <div className="card-body">
                    <div className="row mb-3">
                        <div className="col-sm-3">
                            <strong>Email:</strong>
                        </div>
                        <div className="col-sm-9">
                            {profile.username}
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-sm-3">
                            <strong>Name:</strong>
                        </div>
                        <div className="col-sm-9">
                            {profile.name}
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-sm-3">
                            <strong>Last Name:</strong>
                        </div>
                        <div className="col-sm-9">
                            {profile.lastName}
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-sm-3">
                            <strong>Email Confirmed:</strong>
                        </div>
                        <div className="col-sm-9">
                            {profile.emailConfirmed ? (
                                <span className="badge bg-success">Yes</span>
                            ) : (
                                <span className="badge bg-danger">No</span>
                            )}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-3">
                            <strong>Roles:</strong>
                        </div>
                        <div className="col-sm-9">
                            {profile.roles.join(', ')}
                        </div>
                    </div>
                </div>
            </div>
            <UploadCv/>
        </div>
    );
};


export default Profile;


