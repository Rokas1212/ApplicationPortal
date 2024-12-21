import React, {useEffect, useState} from 'react';
import { SignupDto, signup } from '../services/authService';
import FormInput from '../components/FormInput';

const Signup: React.FC = () => {
    const isAuthenticated = !!localStorage.getItem('accessToken');

    useEffect(() => {
        if(isAuthenticated)
        {
            window.location.href = '/profile';
        }
    }, [isAuthenticated]);
    
    const [formData, setFormData] = useState<SignupDto>({
        name: '',
        lastName: '',
        email: '',
        password: '',
        receiveEmails: false
    });

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value, });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await signup(formData);
            setSuccess(response.message); // Display success message
            setError(null); // Clear any previous error
        } catch (err: any) {
            setError(err.message); // Display error message from the backend
            setSuccess(null); // Clear any previous success message
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
            <h1>Signup</h1>
            <form onSubmit={handleSubmit}>
                <FormInput
                    label="Name"
                    type="text"
                    name="name"
                    value={formData.name}
                    required={true}
                    onChange={handleChange}
                />
                <FormInput
                    label="Last Name"
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    required={true}
                    onChange={handleChange}
                />
                <FormInput
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    required={true}
                    onChange={handleChange}
                />
                <FormInput
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    required={true}
                    onChange={handleChange}
                />
                <FormInput
                    label="Receive New Opportunities By Email?"
                    type="checkbox"
                    name="receiveEmails"
                    checked={formData.receiveEmails}
                    required={false}
                    onChange={handleChange}
                />
                <button type="submit">Signup</button>
            </form>

            {success && <p style={{ color: 'green' }}>{success}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default Signup;