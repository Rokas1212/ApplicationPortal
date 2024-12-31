import React, {useEffect, useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faDownload, faTrash} from '@fortawesome/free-solid-svg-icons';
import {FetchCvDto} from "../../interfaces/ProfileDtos.tsx";
import {deleteCv, getCvs} from "../../services/profileService.tsx";
import Loading from "../Loading.tsx";

interface UserCvsProps {
    reloadFlag: boolean;
}

const UserCvs: React.FC<UserCvsProps> = ({reloadFlag}) => {
    const [cvs, setCvs] = useState<FetchCvDto[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const fetchCvs = async () => {
            try{
                const data = await getCvs();
                setCvs(data);
                setError(null);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to fetch CVS');
            }
        }
        fetchCvs();
    }, [reloadFlag]);

    const handleDeleteCv = async (cvId: string) => {
        try {
            await deleteCv(cvId);
            // Update the state to remove the deleted CV
            setCvs((prevCvs) => prevCvs?.filter((cv) => cv.id !== cvId) || null);
            console.log('CV deleted successfully');
        } catch (error) {
            console.error('Failed to delete CV', error);
        }
    };

    if (error) {
        return (
            <div className="card shadow h-100">
                <div className="card-header bg-light-subtle text-dark-emphasis">
                    <h1 className="h3 mb-0">CVs</h1>
                </div>
                <div className="card-body">
                    <p style={{ color: 'red' }}>{error}</p>
                </div>
            </div>
        );
    }
    
    if(!cvs) {
        return (
            <div className="card shadow h-100">
                <div className="card-header bg-light-subtle text-dark-emphasis">
                    <h1 className="h3 mb-0">CVs</h1>
                </div>
                <div className="card-body">
                    <Loading/>
                </div>
            </div>
        );
    }
    
    return (
        <div className="card shadow h-100">
            <div className="card-header bg-light-subtle text-dark-emphasis">
                <h1 className="h3 mb-0">CVs</h1>
            </div>
            <div className="card-body">
                {cvs?.length === 0 ? (
                    <p>No CVs uploaded yet.</p>
                ) : (
                    <ul className="list-group">
                        {cvs?.map((cv, index) => (
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
                                        onClick={() => handleDeleteCv(cv.id)}
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