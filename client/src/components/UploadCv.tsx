import React, {useState} from "react";
import {uploadCv} from "../services/profileService.tsx";
import FormInput from "./Forminput.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUpload} from "@fortawesome/free-solid-svg-icons";

interface UploadCvProps {
    onUploadSuccess: () => void;
}
const UploadCv: React.FC<UploadCvProps> = ({onUploadSuccess}) => {
    const [cvFile, setCVFile] = useState<File | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [fileName, setFileName] = useState<string>('');

    // Handler for the input change
    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFileName(e.target.value);
    };

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
        formData.append("fileName", fileName ? fileName : cvFile.name);
        try {
            const response = await uploadCv(formData);
            setMessage(response.message || "File uploaded successfully!");
            onUploadSuccess();
        } catch (error: any) {
            setMessage(
                error.response.data.message || "An error occurred during upload."
            );
        } finally {
            setIsUploading(false);
        }
    };
    
    return (
        <div className="card shadow h-100">
            <div className="card-header bg-light-subtle text-dark-emphasis">
                <h1 className="h3 mb-0">Upload Your CV</h1>
            </div>
            <div className="card-body">
                <FormInput
                    label="Select CV File (PDF)"
                    type="file"
                    name="cvFile"
                    required={true}
                    onChange={handleFileChange}
                    bootstrapStyling="mb-3"
                />
                <FormInput
                    label="Enter File Name"
                    type="text"
                    name="fileName"
                    required={false}
                    value={fileName}
                    onChange={handleOnChange}
                    bootstrapStyling="mb-3"
                />
                <button
                    className="btn btn-sm btn-dark"
                    onClick={handleUpload}
                    disabled={isUploading}
                >
                    {isUploading ? "Uploading..." : <FontAwesomeIcon icon={faUpload}/>}
                </button>
                {message && <p className="mt-3">{message}</p>}
            </div>
        </div>
    );
}

export default UploadCv;
