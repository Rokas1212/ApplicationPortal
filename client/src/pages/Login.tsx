import React, {useEffect, useState} from 'react';
import { LoginDto, login } from '../services/authService';
import FormInput from '../components/FormInput';

const Login: React.FC = () => {
    const isAuthenticated = !!localStorage.getItem('accessToken');

    useEffect(() => {
        if(isAuthenticated)
        {
            window.location.href = '/profile';
        }
    }, [isAuthenticated]);
    
    const [formData, setFormData] = useState<LoginDto>({
        userName: '',
        password: ''
    });

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value, type, checked} = e.target;
        setFormData({...formData, [name]: type === 'checkbox' ? checked : value});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { accessToken, refreshToken } = await login(formData);

            // Store tokens
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            setSuccess('Login successful!');
            setError(null);
        } catch (error: any) {
            setError(error.message || 'Login failed. Please try again.');
            setSuccess(null);
        }
    };
    
    return (
        <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <FormInput
                    label="Email"
                    type="email"
                    name="userName"
                    value={formData.userName}
                    required={true}
                    onChange={handleChange}
                    bootstrapStyling="mb-3"
                />
                <FormInput
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    required={true}
                    onChange={handleChange}
                    bootstrapStyling="mb-3"
                />
                <button type="submit" className="btn btn-primary">Login</button>
            </form>

            {success && <p style={{ color: 'green' }}>{success}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default Login;