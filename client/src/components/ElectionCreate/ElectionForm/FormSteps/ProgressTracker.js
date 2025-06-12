import React from 'react';
import PropTypes from 'prop-types';
import { Check } from 'lucide-react';

const ProgressTracker = ({ currentStep }) => {
    const steps = [
        { number: 1, label: 'Basic Info' },
        { number: 2, label: 'Candidate Names' },
        { number: 3, label: 'Candidate Details' },
        { number: 4, label: 'Settings' },
        { number: 5, label: 'Review' },
        { number: 6, label: "Payment"},
    ];

    return (
        <div className="flex items-center justify-center px-4">
            <div className="flex items-center w-full max-w-4xl">
                {steps.map((step, index) => (
                    <React.Fragment key={step.number}>
                        <div className="flex flex-col items-center flex-1">
                            <div className={`
                                w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm transition-all duration-200 relative z-10
                                ${currentStep > step.number
                                ? 'bg-white text-purple-600 shadow-md border-2 border-white'
                                : currentStep === step.number
                                    ? 'bg-white text-purple-600 shadow-lg ring-4 ring-white/30 border-2 border-white'
                                    : 'bg-purple-400/30 text-white/70 border-2 border-purple-400/50'
                            }
                            `}>
                                {currentStep > step.number ? (
                                    <Check size={16} />
                                ) : (
                                    step.number
                                )}
                            </div>
                            <p className={`
                                mt-2 text-xs font-medium text-center whitespace-nowrap transition-colors duration-200
                                ${currentStep >= step.number ? 'text-white' : 'text-white/60'}
                            `}>
                                {step.label}
                            </p>
                        </div>

                        {index < steps.length - 1 && (
                            <div className={`
                                h-0.5 flex-1 transition-colors duration-200 -mx-5 relative
                                ${currentStep > step.number ? 'bg-white' : 'bg-purple-400/30'}
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