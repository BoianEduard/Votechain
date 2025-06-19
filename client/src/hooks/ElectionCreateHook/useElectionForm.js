import { useState } from 'react';

export const useElectionForm = () => {
    const [form, setForm] = useState({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        candidates: [
            { name: "", image: null, imagePreview: "", description: "" },
            { name: "", image: null, imagePreview: "", description: "" }
        ],
        eligibilityType: "all",
        whitelist: "",
        domainWhitelist: "",
        realTimeResults: false,
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleCandidateChange = (index, field, value) => {
        const updatedCandidates = [...form.candidates];
        if (typeof field === 'string' && value !== undefined) {
            updatedCandidates[index] = {
                ...updatedCandidates[index],
                [field]: value
            };
        } else {
            updatedCandidates[index] = {
                ...updatedCandidates[index],
                name: field
            };
        }
        setForm(prev => ({ ...prev, candidates: updatedCandidates }));
    };

    const handleCandidateImageChange = (index, file) => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const updatedCandidates = [...form.candidates];
                updatedCandidates[index] = {
                    ...updatedCandidates[index],
                    image: file,
                    imagePreview: reader.result
                };
                setForm(prev => ({ ...prev, candidates: updatedCandidates }));
            };
            reader.readAsDataURL(file);
        } else {
            const updatedCandidates = [...form.candidates];
            updatedCandidates[index] = {
                ...updatedCandidates[index],
                image: null,
                imagePreview: ""
            };
            setForm(prev => ({ ...prev, candidates: updatedCandidates }));
        }
    };

    const addCandidate = () => {
        setForm(prev => ({
            ...prev,
            candidates: [...prev.candidates, { name: "", image: null, imagePreview: "", description: "" }]
        }));
    };

    const removeCandidate = (index) => {
        if (form.candidates.length > 2) {
            const updatedCandidates = form.candidates.filter((_, i) => i !== index);
            setForm(prev => ({ ...prev, candidates: updatedCandidates }));
        }
    };

    const resetForm = () => {
        setForm({
            title: "",
            description: "",
            startDate: "",
            endDate: "",
            candidates: [
                { name: "", image: null, imagePreview: "", description: "" },
                { name: "", image: null, imagePreview: "", description: "" }
            ],
            eligibilityType: "all",
            whitelist: "",
            domainWhitelist: "",
            realTimeResults: false,
        });
    };

    return {
        form,
        setForm,
        handleInputChange,
        handleCandidateChange,
        handleCandidateImageChange,
        addCandidate,
        removeCandidate,
        resetForm
    };
};