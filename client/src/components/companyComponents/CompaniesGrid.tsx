import React, {useEffect, useState} from 'react';
import {fetchCompanies} from "../../services/companyService.tsx";
import {FetchCompanyDto} from "../../interfaces/CompanyDtos.tsx";
import {redirect, useNavigate} from "react-router-dom";

const CompaniesGrid:React.FC =  () => {
    const [companies, setCompanies] = useState<FetchCompanyDto[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchCompaniesList = async() => {
            try {
                const data = await fetchCompanies();
                setCompanies(data);
                setError(null);
            } catch (error: any) {
                setError(error.response?.data?.message || 'Failed to fetch companies');
            }
        }
        fetchCompaniesList();
    }, []);

    if (error) {
        return (
            <div className="row">
                <p style={{color: 'red'}}>{error}</p>
            </div>
        );
    }
    
    return (
            <div className="row">
                {companies?.map((company, index) => (
                    <div key={index} onClick={() => navigate(`/company/${index}`)} className="col-md-3 mb-4" style={{cursor: "pointer"}}>
                        <div className="card shadow h-100">
                            <img
                                src={company.companyLogoUrl || "https://via.placeholder.com/400x300?text=No+Logo"}
                                className="card-img-top img-fluid"
                                alt={company.companyName || "Company Logo"}
                                style={{height: "250px", objectFit: "cover"}}
                            />
                            <div className="card-body">
                                <h5 className="card-title">{company.companyName}</h5>
                                <p className="card-text">
                                    {company.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
    );
}

export default CompaniesGrid;