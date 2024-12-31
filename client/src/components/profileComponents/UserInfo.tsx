import React, {useEffect, useState} from 'react';
import {ProfileDto} from "../../interfaces/ProfileDtos.tsx";
import {getProfile} from "../../services/profileService.tsx";
import Loading from "../Loading.tsx";

const UserInfo: React.FC = () => {
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
        return (
            <div className="card shadow h-100">
                <div className="card-header bg-light-subtle text-dark-emphasis">
                    <h1 className="h3 mb-0">Profile</h1>
                </div>
                <div className="card-body">
                    <p style={{ color: 'red' }}>{error}</p>
                </div>
            </div>
        );
    }

    if(!profile) {
        return (
            <div className="card shadow h-100">
                <div className="card-header bg-light-subtle text-dark-emphasis">
                    <h1 className="h3 mb-0">Profile</h1>
                </div>
                <div className="card-body">
                    <Loading />
                </div>
            </div>
        );
    }
    
    return (
        <div className="card shadow h-100">
            <div className="card-header bg-light-subtle text-dark-emphasis">
                <h1 className="h3 mb-0">Profile</h1>
            </div>
            <div className="card-body">
                <div className="row mb-3">
                    <div className="col-sm-3">
                        <strong>Email:</strong>
                    </div>
                    <div className="col-sm-9">{profile.username}</div>
                </div>
                <div className="row mb-3">
                    <div className="col-sm-3">
                        <strong>Name:</strong>
                    </div>
                    <div className="col-sm-9">{profile.name}</div>
                </div>
                <div className="row mb-3">
                    <div className="col-sm-3">
                        <strong>Last Name:</strong>
                    </div>
                    <div className="col-sm-9">{profile.lastName}</div>
                </div>
                <div className="row mb-3">
                    <div className="col-sm-3">
                        <strong>Email:</strong>
                    </div>
                    <div className="col-sm-9">
                        {profile.emailConfirmed ? (
                            <span className="badge bg-success">Confirmed</span>
                        ) : (
                            <span className="badge bg-danger">Unconfirmed</span>
                        )}
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-3">
                        <strong>Roles:</strong>
                    </div>
                    <div className="col-sm-9">{profile.roles.join(', ')}</div>
                </div>
            </div>
        </div>
    );
};

export default UserInfo;