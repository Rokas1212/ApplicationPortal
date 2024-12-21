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

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Navbar/>
            <Routes>
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<Profile/>}/>
            </Routes>
        </BrowserRouter>
    </StrictMode>,
);