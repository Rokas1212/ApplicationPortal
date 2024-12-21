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
        <nav className="navbar navbar-expand-lg navbar-light bg-body-tertiary sticky-top">
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
                        {!isAuthenticated ? (
                            <>
                                <NavLink className="nav-link" to="/login">
                                    Login
                                </NavLink>
                                <NavLink className="nav-link" to="/signup">
                                    Signup
                                </NavLink>
                            </>
                        ) : (
                            <>
                                <NavLink className="nav-link" to="/profile">
                                    Profile
                                </NavLink>
                                <button
                                    className="nav-link btn btn-link"
                                    onClick={handleLogout}
                                    style={{ padding: 0, border: 'none', background: 'none' }}
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