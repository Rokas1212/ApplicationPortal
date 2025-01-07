import React from "react";
import CompanyInfo from "../components/companyComponents/CompanyInfo";
import {useParams} from "react-router-dom";

const Company:React.FC = () => {
    const { companyId } = useParams<{ companyId: string }>();
    
    const id = parseInt(companyId!, 10);
    
    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col">
                    <CompanyInfo id={id}/>
                </div>
            </div>
        </div>
    );
}

export default Company;