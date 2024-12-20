import React from 'react';

interface FormInputProps {
    label: string;
    type: string;
    name: string;
    value?: string;
    checked?: boolean;
    required: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormInput: React.FC<FormInputProps> = ({ label, type, name, value, checked, required, onChange }) => {
    return (
        <div>
            <label htmlFor={name}>{label}</label>
            <input
                type={type}
                id={name}
                name={name}
                value={type === 'checkbox' ? undefined : value} // Don't pass value for checkboxes
                checked={type === 'checkbox' ? checked : undefined} // Use checked for checkboxes
                onChange={onChange}
                required={required}
                style={{ display: 'block', marginBottom: '10px' }}
            />
        </div>
    );
};

export default FormInput;