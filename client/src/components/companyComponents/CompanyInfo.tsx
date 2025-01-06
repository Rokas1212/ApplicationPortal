import React, {useEffect, useState} from "react";
import {FetchCompanyDto} from "../../interfaces/CompanyDtos.tsx";
import {fetchCompany} from "../../services/companyService.tsx";
interface CompanyInfoProps {
    id: number;
}
const CompanyInfo:React.FC<CompanyInfoProps> = ( {id}) => {

    const [company, setCompany] = useState<FetchCompanyDto | null>(null);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const fetchCompanyInfo = async() => {
            try {
                const data = await fetchCompany(id);
                setCompany(data);
                setError(null);
            } catch (error: any) {
                setError(error.response?.data?.message || 'Failed to fetch companies');
            }
        }
        fetchCompanyInfo();
    }, [id]);


    if (error) {
        return (
            <div className="row">
                <p style={{color: 'red'}}>{error}</p>
            </div>
        );
    }
    
    return (
        <div className="card shadow h-100">
            <div className="card-header bg-light-subtle text-dark-emphasis">
                <h1 className="h3 mb-0">Company Profile</h1>
                <img className="card-img" src={company?.companyLogoUrl} alt="company logo"/>
            </div>
            <div className="card-body">
                <div className="row mb-3">
                    <div className="col-sm-3">
                        <strong>Name:</strong>
                    </div>
                    <div className="col-sm-9">{company?.companyName}</div>
                </div>
                <div className="row mb-3">
                    <div className="col-sm-3">
                        <strong>Description:</strong>
                    </div>
                    <div className="col-sm-9">{company?.description}</div>
                </div>
                <div className="row mb-3">
                    <div className="col-sm-3">
                        <strong>Website:</strong>
                    </div>
                    <div className="col-sm-9"><a href={company?.websiteUrl}>Website</a></div>
                </div>
                <div className="row mb-3">
                    <div className="col-sm-3">
                        <strong>Address:</strong>
                    </div>
                    <div className="col-sm-9">{company?.companyAddress}</div>
                </div>
            </div>
        </div>
    );
}

export default CompanyInfo;