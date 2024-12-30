import React, {useState} from "react";
import FormInput from "../Forminput.tsx";
import {AdminDtos, Roles} from "../../interfaces/AdminDtos.tsx";
import {createUser} from "../../services/adminService.tsx";

const CreateUser:React.FC = () => {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [formData, setFormData] = useState<AdminDtos>({
        name: "",
        lastName: "",
        email: "",
        password: "",
        role: Roles.JobSeeker,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value, type, checked} = e.target;
        setFormData({...formData, [name]: type === 'checkbox' ? checked : value});
    };

    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        setFormData({...formData, role: value as Roles });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = await createUser(formData);
            setSuccess(data.message);
            setError(null);
        } catch (err: any) {
            setError(err.message);
        }
    };
    
    return (
        <div className="card shadow h-100">
            <div className="card-header bg-light-subtle text-dark-emphasis">
                <h1 className="h3 mb-0">Create User</h1>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    {/* First Name */}
                    <FormInput
                        label="First Name"
                        type="text"
                        name="name"
                        value={formData.name}
                        required={true}
                        onChange={handleChange}
                        bootstrapStyling="mb-3"
                    />
    
                    {/* Last Name */}
                    <FormInput
                        label="Last Name"
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        required={true}
                        onChange={handleChange}
                        bootstrapStyling="mb-3"
                    />
    
                    {/* Email */}
                    <FormInput
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        required={true}
                        onChange={handleChange}
                        bootstrapStyling="mb-3"
                    />
    
                    {/* Password */}
                    <FormInput
                        label="Password"
                        type="password"
                        name="password"
                        value={formData.password}
                        required={true}
                        onChange={handleChange}
                        bootstrapStyling="mb-3"
                    />
    
                    {/* Role Selection */}
                    <div className="mb-3">
                        <label htmlFor="roleDropdown" className="form-label">
                            Select Role
                        </label>
                        <select
                            id="roleDropdown"
                            name="role"
                            value={formData.role}
                            onChange={handleRoleChange}
                            className="form-select"
                            required
                        >
                            {Object.values(Roles).map((role) => (
                                <option key={role} value={role}>
                                    {role}
                                </option>
                            ))}
                        </select>
                    </div>
    
                    {/* Submit Button */}
                    <button type="submit" className="btn btn-primary">
                        Create User
                    </button>
                </form>
                {success && <p style={{ color: 'green' }}>{success}</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        </div>
    );
}

export default CreateUser