import { useState } from 'react';

// Hook pentru gestionarea formularului de register
export const useRegisterForm = (initialValues = {}) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
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
            firstName: '',
            lastName: '',
            ...initialValues
        });
    };

    const validateForm = () => {
        if (!formData.firstName) {
            return {
                isValid: false,
                firstError: 'First name is required'
            };
        }

        if (!formData.lastName) {
            return {
                isValid: false,
                firstError: 'Last name is required'
            };
        }

        if (!formData.email) {
            return {
                isValid: false,
                firstError: 'Email is required'
            };
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            return {
                isValid: false,
                firstError: 'Email is invalid'
            };
        }

        if (!formData.password) {
            return {
                isValid: false,
                firstError: 'Password is required'
            };
        } else if (formData.password.length < 8) {
            return {
                isValid: false,
                firstError: 'Password must be at least 8 characters'
            };
        }

        return {
            isValid: true,
            firstError: null
        };
    };

    return {
        formData,
        updateField,
        resetForm,
        validateForm
    };
};