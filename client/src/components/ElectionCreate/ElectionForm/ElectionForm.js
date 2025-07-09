import React from "react";
import PropTypes from "prop-types";
import BasicInfoStep from "../FormSteps/BasicInfoStep";
import CandidatesStep from "../FormSteps/CandidateStep";
import CandidateInfoStep from "../FormSteps/CandidateInfoStep";
import SettingsStep from "../FormSteps/SettingsStep";
import PaymentStep from "../FormSteps/PaymentStep";
import ReviewStep from "../FormSteps/ReviewStep";
import "./ElectionForm.css";

const ElectionForm = ({
                          formData,
                          handleInputChange,
                          handleCandidateChange,
                          handleCandidateImageChange,
                          addCandidate,
                          removeCandidate,

                          step,
                          nextStep,
                          prevStep,

                          loading,
                          success,

                          paymentCompleted,
                          paymentError,
                          onPaymentSuccess,
                          resetPayment,
                      }) => {
    return (
        <div className="election-form-container">
            <div className="form-card">
                {step === 1 && (
                    <BasicInfoStep
                        formData={formData}
                        handleInputChange={handleInputChange}
                        nextStep={nextStep}
                    />
                )}

                {step === 2 && (
                    <CandidatesStep
                        formData={formData}
                        handleCandidateChange={handleCandidateChange}
                        addCandidate={addCandidate}
                        removeCandidate={removeCandidate}
                        nextStep={nextStep}
                        prevStep={prevStep}
                    />
                )}

                {step === 3 && (
                    <CandidateInfoStep
                        formData={formData}
                        handleCandidateImageChange={handleCandidateImageChange}
                        handleCandidateChange={handleCandidateChange}
                        nextStep={nextStep}
                        prevStep={prevStep}
                    />
                )}

                {step === 4 && (
                    <SettingsStep
                        formData={formData}
                        handleInputChange={handleInputChange}
                        nextStep={nextStep}
                        prevStep={prevStep}
                    />
                )}

                {step === 5 && (
                    <ReviewStep
                        formData={formData}
                        prevStep={prevStep}
                        nextStep={nextStep}
                        loading={loading}
                    />
                )}

                {step === 6 && (
                    <PaymentStep
                        formData={formData}
                        prevStep={prevStep}
                        onPaymentSuccess={onPaymentSuccess}
                        loading={loading}
                        paymentCompleted={paymentCompleted}
                        paymentError={paymentError}
                        resetPayment={resetPayment}
                    />
                )}
            </div>
        </div>
    );
};

ElectionForm.propTypes = {
    formData: PropTypes.object.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    handleCandidateChange: PropTypes.func.isRequired,
    handleCandidateImageChange: PropTypes.func.isRequired,
    addCandidate: PropTypes.func.isRequired,
    removeCandidate: PropTypes.func.isRequired,

    step: PropTypes.number.isRequired,
    nextStep: PropTypes.func.isRequired,
    prevStep: PropTypes.func.isRequired,

    loading: PropTypes.bool.isRequired,
    success: PropTypes.bool,

    paymentCompleted: PropTypes.bool,
    paymentError: PropTypes.string,
    onPaymentSuccess: PropTypes.func.isRequired,
    resetPayment: PropTypes.func,
};

export default ElectionForm;