import React from 'react';
import {FetchCvDto} from "../services/profileService.tsx";

interface UserCvsProps {
    cvs: FetchCvDto[];
}
const UserCvs: React.FC<UserCvsProps> = ({ cvs }) => {
    
    
    return (
        <div className="card shadow">
            <div className="card-header bg-primary text-white">
                <h1 className="h3 mb-0">Your CVS</h1>
            </div>
            <div className="card-body">
                {cvs.length === 0 ? (
                    <p>No CVs uploaded yet.</p>
                ) : (
                    <ul className="list-group">
                        {cvs.map((cv, index) => (
                            <li className="list-group-item d-flex justify-content-between align-items-center"
                                key={index}>
                                <span>{cv.fileName}</span>
                                <a
                                    href={cv.cvFileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-sm btn-primary"
                                >
                                    Download
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default UserCvs;