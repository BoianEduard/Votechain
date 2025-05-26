import { useState } from 'react';
import * as validator from '../../utils/validators';

export const useFormValidation = () => {
    const [validationErrors, setValidationErrors] = useState({});

    const validateStep = (step, formData) => {
        const errors = {};

        try {
            if (step === 1) {
                const dateValidation = validator.validateDates(formData.startDate, formData.endDate);
                if (!dateValidation.isValid) {
                    errors.dates = dateValidation.error;
                }

                const titleAndDescValidation = validator.validateTitleDescription(formData.title, formData.description);
                if (!titleAndDescValidation.isValid) {
                    errors.titleDescription = titleAndDescValidation.error;
                }
            } else if (step === 2) {
                const candidateNames = formData.candidates.map(c => typeof c === 'string' ? c : c.name);
                const candidateValidation = validator.validateCandidates(candidateNames);
                if (!candidateValidation.isValid) {
                    errors.candidates = candidateValidation.error;
                }
            } else if (step === 4) {
                if (formData.eligibilityType === 'whitelist') {
                    const whitelistValidation = validator.validateWhitelist(formData.whitelist);
                    if (!whitelistValidation.isValid) {
                        errors.whitelist = whitelistValidation.error;
                    }
                } else if (formData.eligibilityType === 'domain') {
                    const domainValidation = validator.validateDomainWhitelist(formData.domainWhitelist);
                    if (!domainValidation.isValid) {
                        errors.domainWhitelist = domainValidation.error;
                    }
                }
            }
        } catch (error) {
            console.error('Validation error:', error);
            errors.general = 'Validation failed. Please check your inputs.';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const clearValidationErrors = () => {
        setValidationErrors({});
    };

    const addValidationError = (field, message) => {
        setValidationErrors(prev => ({
            ...prev,
            [field]: message
        }));
    };

    return {
        validationErrors,
        validateStep,
        clearValidationErrors,
        addValidationError
    };
};