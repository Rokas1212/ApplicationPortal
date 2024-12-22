import React from 'react';
import {FetchCvDto} from "../services/profileService.tsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faDownload, faTrash} from '@fortawesome/free-solid-svg-icons';

interface UserCvsProps {
    cvs: FetchCvDto[];
}
const UserCvs: React.FC<UserCvsProps> = ({ cvs }) => {
    
    
    return (
        <div className="card shadow h-100">
            <div className="card-header bg-light-subtle text-dark-emphasis">
                <h1 className="h3 mb-0">CVs</h1>
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
                                <div className="d-flex">
                                    <a
                                        href={cv.cvFileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-sm btn-dark me-2"
                                    >
                                        <FontAwesomeIcon icon={faDownload}/>
                                    </a>
                                    <a
                                        className="btn btn-sm btn-danger"
                                        //TODO Implement DELETE
                                        onClick={() => {}}
                                    >
                                        <FontAwesomeIcon icon={faTrash}/>
                                    </a>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default UserCvs;