import React from 'react';

interface FormInputProps {
    label: string;
    type: string;
    name: string;
    value?: string;
    checked?: boolean;
    required: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    bootstrapStyling?: string;
}

const FormInput: React.FC<FormInputProps> = ({ label, type, name, value, checked, required, onChange, bootstrapStyling }) => {
    return (
        <div className={bootstrapStyling}>
            <label className={type === 'checkbox' ? "form-check-label" : "form-label"} htmlFor={name}>{label}</label>
            <input
                type={type}
                id={name}
                name={name}
                value={type === 'checkbox' ? undefined : value} // Don't pass value for checkboxes
                checked={type === 'checkbox' ? checked : undefined} // Use checked for checkboxes
                onChange={onChange}
                required={required}
                className={type === 'checkbox' ? "form-check-input" : "form-control"}
            />
        </div>
    );
};

export default FormInput;