import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Import Router and Route
import './index.css';
import Signup from './pages/Signup';
import Login from "./pages/Login.tsx";
import Profile from "./pages/Profile.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="profile" element={<Profile/>}/>
            </Routes>
        </BrowserRouter>
    </StrictMode>,
);