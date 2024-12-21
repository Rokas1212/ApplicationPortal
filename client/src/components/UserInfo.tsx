import React from 'react';
import { ProfileDto } from '../services/profileService';

interface UserInfoProps {
    profile: ProfileDto;
}

const UserInfo: React.FC<UserInfoProps> = ({ profile }) => {
    return (
        <div className="card shadow">
            <div className="card-header bg-primary text-white">
                <h1 className="h3 mb-0">User Profile</h1>
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
                    <div className="col-sm-9">{profile.roles.join(', ')}</div>
                </div>
            </div>
        </div>
    );
};

export default UserInfo;