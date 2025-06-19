import { useState } from 'react';

export const useFormNavigation = (totalSteps = 6) => {
    const [step, setStep] = useState(1);

    const nextStep = () => {
        if (step < totalSteps) {
            setStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        if (step > 1) {
            setStep(prev => prev - 1);
        }
    };

    const goToStep = (stepNumber) => {
        if (stepNumber >= 1 && stepNumber <= totalSteps) {
            setStep(stepNumber);
        }
    };

    const resetToFirstStep = () => {
        setStep(1);
    };

    return {
        step,
        nextStep,
        prevStep,
        goToStep,
        resetToFirstStep,
        isFirstStep: step === 1,
        isLastStep: step === totalSteps
    };
};
