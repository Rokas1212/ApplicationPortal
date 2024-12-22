import React, { useState } from 'react';
import UploadCv from "../components/UploadCv.tsx";
import UserInfo from "../components/UserInfo.tsx";
import UserCvs from "../components/UserCvs.tsx";

const Profile: React.FC = () => {
    const [reloadFlag, setReloadFlag] = useState(false);

    const triggerReload = () => {
        setReloadFlag(prev => !prev);
    };

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-6">
                    <UserInfo/>
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


