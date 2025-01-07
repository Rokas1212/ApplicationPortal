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
            </div>
            <div className="row card-body" style={{ flexWrap: 'nowrap', gap: '20px' }}>
                <div className="col-4 d-flex justify-content-center align-items-center w-auto">
                    <img
                        className="card-img"
                        src={company?.companyLogoUrl}
                        alt="company logo"
                        style={{ width: '250px', height: '250px', border:"1px solid black", borderRadius: '8px', objectFit: "cover" }}
                    />
                </div>
                <div className="col-8">
                    <div className="row mb-3">
                        <div className="col-sm-2 text-nowrap">
                            <strong>Name:</strong>
                        </div>
                        <div className="col-sm-9">{company?.companyName}</div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-sm-2 text-nowrap">
                            <strong>Description:</strong>
                        </div>
                        <div className="col-sm-9">{company?.description ? company.description : "The company has not provided a description."}</div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-sm-2 text-nowrap">
                            <strong>Website:</strong>
                        </div>
                        <div className="col-sm-9">
                            {company?.websiteUrl 
                            ? 
                                <a href={company?.websiteUrl} target="_blank" rel="noopener noreferrer">
                                    {company?.websiteUrl}
                                </a>
                            :
                                "The company does not have a website."
                            }
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-sm-2 text-nowrap">
                            <strong>Address:</strong>
                        </div>
                        <div className="col-sm-9">{company?.companyAddress}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CompanyInfo;