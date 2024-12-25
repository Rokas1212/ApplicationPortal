import React from 'react';
import CompanyGrid from "../components/CompanyGrid.tsx";

const Home: React.FC = () => {
    return (
        <div className="container mt-4">
            <h1>Companies</h1>
            <CompanyGrid/>  
        </div>
    );
}

export default Home;