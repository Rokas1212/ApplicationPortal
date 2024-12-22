import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './styles/navbar.css';

const Navbar: React.FC = () => {
    const isAuthenticated = !!localStorage.getItem('accessToken');

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-transparent sticky-top border-bottom border-dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">ApplicationPortal</Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNavAltMarkup"
                    aria-controls="navbarNavAltMarkup"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav">
                        <NavLink className="btn btn-outline-secondary text-light mx-1" to="/">
                            Home
                        </NavLink>
                        {!isAuthenticated ? (
                            <>
                                <NavLink className="btn btn-outline-secondary text-light mx-1" to="/login">
                                    Login
                                </NavLink>
                                <NavLink className="btn btn-outline-secondary text-light mx-1" to="/signup">
                                    Signup
                                </NavLink>
                            </>
                        ) : (
                            <>
                                <NavLink className="btn btn-outline-secondary text-light mx-1" to="/profile">
                                    Profile
                                </NavLink>
                                <button
                                    className="btn btn-outline-secondary text-light mx-1"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;