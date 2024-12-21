import React, {useState} from "react";
import axios from 'axios';
import FormInput from "./Forminput.tsx";

const UploadCv: React.FC = () => {
    const [cvFile, setCVFile] = useState<File | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const BASE_URL = `${API_BASE_URL}/profile`;

    // Handle file input change
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type === "application/pdf") {
                setCVFile(file);
                setMessage(null);
            } else {
                setMessage("Please select a valid PDF file.");
            }
        }
    };

    // Handle file upload
    const handleUpload = async () => {
        if (!cvFile) {
            setMessage("Please select a file to upload.");
            return;
        }

        setIsUploading(true);

        const formData = new FormData();
        formData.append("cvFile", cvFile);

        try {
            const response = await axios.post(
                `${BASE_URL}/cv-upload`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setMessage(response.data.message || "File uploaded successfully!");
        } catch (error: any) {
            setMessage(
                error.response?.data?.message || "An error occurred during upload."
            );
        } finally {
            setIsUploading(false);
        }
    };
    
    return (
        <div className="container mt-5">
            <h2>Upload Your CV</h2>
            <FormInput
                label="Select CV File (PDF)"
                type="file"
                name="cvFile"
                required={true}
                onChange={handleFileChange}
            />
            <button
                className="btn btn-primary"
                onClick={handleUpload}
                disabled={isUploading}
            >
                {isUploading ? "Uploading..." : "Upload CV"}
            </button>
            {message && <p className="mt-3">{message}</p>}
        </div>
    );
}

export default UploadCv;
