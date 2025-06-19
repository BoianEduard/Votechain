import { useState } from 'react';

export const useAuthForm = (initialValues = {}) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        ...initialValues
    });

    const updateField = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const resetForm = () => {
        setFormData({
            email: '',
            password: '',
            ...initialValues
        });
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.email) {
            errors.email = 'Email is required';
        }

        if (!formData.password) {
            errors.password = 'Password is required';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    };

    return {
        formData,
        updateField,
        resetForm,
        validateForm
    };
};