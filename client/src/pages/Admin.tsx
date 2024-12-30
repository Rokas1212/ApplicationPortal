import React from "react";
import CreateUser from "../components/adminComponents/CreateUser.tsx";


const Admin: React.FC = () => {
    
    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-6">
                    <CreateUser/>
                </div>
            </div>
        </div>
    );
};

export default Admin;