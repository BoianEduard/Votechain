import React from 'react';
import PropTypes from 'prop-types';
import { Check } from 'lucide-react';

const ProgressTracker = ({ currentStep }) => {
    const steps = [
        { number: 1, label: 'Basic Info' },
        { number: 2, label: 'Candidate Names' },
        { number: 3, label: 'Candidate Details' },
        { number: 4, label: 'Settings' },
        { number: 5, label: 'Review' }
    ];

    return (
        <div className="flex items-center justify-center mb-8 px-4">
            <div className="flex items-center space-x-2 md:space-x-4 overflow-x-auto">
                {steps.map((step, index) => (
                    <React.Fragment key={step.number}>
                        <div className="flex flex-col items-center min-w-0 flex-shrink-0">
                            <div className={`
                                w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-medium text-sm md:text-base transition-all duration-200
                                ${currentStep > step.number
                                ? 'bg-indigo-600 text-white shadow-md'
                                : currentStep === step.number
                                    ? 'bg-indigo-600 text-white shadow-md ring-4 ring-indigo-100'
                                    : 'bg-gray-200 text-gray-500'
                            }
                            `}>
                                {currentStep > step.number ? (
                                    <Check size={16} />
                                ) : (
                                    step.number
                                )}
                            </div>
                            <p className={`
                                mt-2 text-xs md:text-sm font-medium text-center whitespace-nowrap transition-colors duration-200
                                ${currentStep >= step.number ? 'text-indigo-600' : 'text-gray-500'}
                            `}>
                                {step.label}
                            </p>
                        </div>

                        {index < steps.length - 1 && (
                            <div className={`
                                h-0.5 w-8 md:w-12 transition-colors duration-200 flex-shrink-0
                                ${currentStep > step.number ? 'bg-indigo-600' : 'bg-gray-200'}
                            `} />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

ProgressTracker.propTypes = {
    currentStep: PropTypes.number.isRequired
};

export default ProgressTracker;