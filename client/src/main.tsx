import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Import Router and Route
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './index.css';
import Signup from './pages/Signup';
import Login from "./pages/Login.tsx";
import Profile from "./pages/Profile.tsx";
import Navbar from "./components/Navbar.tsx";
import Home from "./pages/Home.tsx";
import Admin from "./pages/Admin.tsx";
import Company from "./pages/Company.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Navbar/>
            <Routes>
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<Profile/>}/>
                <Route path="/" element={<Home/>}/>
                <Route path="/adminPanel" element={<Admin/>}/>
                <Route path="/company/:companyId" element={<Company />} />
                <Route path="/company" element={<div>Please provide a company ID</div>} />
            </Routes>
        </BrowserRouter>
    </StrictMode>,
);