import React from 'react';
import CompaniesGrid from "../components/companyComponents/CompaniesGrid.tsx";

const Home: React.FC = () => {
    return (
        <div className="container mt-4">
            <h1>Companies</h1>
            <CompaniesGrid/>  
        </div>
    );
}

export default Home;