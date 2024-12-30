import React, { useState } from "react";
import FormInput from "../components/Forminput";
import {createUser} from "../services/adminService.tsx";
import {AdminDtos, Roles} from "../components/interfaces/AdminDtos.tsx";


const Admin: React.FC = () => {
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
            const response = await createUser(formData);
            alert(response.message); // Display success message
        } catch (err: any) {
            alert(err.response.message);
        }
    };


    return (
        <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
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
        </div>
    );
};

export default Admin;