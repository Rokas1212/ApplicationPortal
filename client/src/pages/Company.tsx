import React from "react";
import CompanyInfo from "../components/companyComponents/CompanyInfo";
import {useNavigate, useParams} from "react-router-dom";

const Company:React.FC = () => {
    const navigate = useNavigate();
    const { companyId } = useParams<{ companyId: string }>();
    
    const id = parseInt(companyId!, 10);
    
    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col">
                    <CompanyInfo id={id}/>
                </div>
            </div>
            <div className="row">
                <button onClick={() => navigate("/")} className="btn btn-primary col-sm-1 m-sm-3">Back</button>
            </div>
        </div>
    );
}

export default Company;