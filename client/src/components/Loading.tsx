import React from 'react';


const Loading: React.FC = () => {
    return (
        <div className="position-absolute top-50 start-50 translate-middle">
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
}

export default Loading;