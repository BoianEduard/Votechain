import React from "react";
import PropTypes from "prop-types";
import BasicInfoStep from "./FormSteps/BasicInfoStep";
import CandidatesStep from "./FormSteps/CandidateStep";
import CandidateInfoStep from "./FormSteps/CandidateInfoStep";
import SettingsStep from "./FormSteps/SettingsStep";
import PaymentStep from "./FormSteps/PaymentStep";
import ReviewStep from "./FormSteps/ReviewStep";
import "./ElectionForm.css";

const ElectionForm = ({
                          formData,
                          handleInputChange,
                          handleCandidateChange,
                          handleCandidateImageChange,
                          addCandidate,
                          removeCandidate,
                          handleSubmit,
                          loading,
                          error,
                          step,
                          nextStep,
                          prevStep,
                          // Payment flow props
                          paymentId,
                          paymentCompleted,
                          paymentError,
                          processingPayment,
                          onPaymentStart,
                          onPaymentSuccess,
                          onPaymentError,
                          resetPayment,
                          setPaymentError
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
                        loading = {loading}/>
                )}

                {step === 6 && (
                    <PaymentStep
                        formData={formData}
                        prevStep={prevStep}
                        onPaymentSuccess={onPaymentSuccess}
                        handleSubmit={handleSubmit}
                        loading={loading}
                        // Payment flow props - now properly passed through
                        paymentId={paymentId}
                        paymentCompleted={paymentCompleted}
                        paymentError={paymentError}
                        processingPayment={processingPayment}
                        onPaymentStart={onPaymentStart}
                        onPaymentSuccessHook={onPaymentSuccess} // Map to expected prop name
                        onPaymentError={onPaymentError}
                        resetPayment={resetPayment}
                        setPaymentError={setPaymentError}
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
    handleSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    step: PropTypes.number.isRequired,
    nextStep: PropTypes.func.isRequired,
    prevStep: PropTypes.func.isRequired,
    // Payment flow props
    paymentId: PropTypes.string,
    paymentCompleted: PropTypes.bool,
    paymentError: PropTypes.string,
    processingPayment: PropTypes.bool,
    onPaymentStart: PropTypes.func,
    onPaymentSuccess: PropTypes.func.isRequired,
    onPaymentError: PropTypes.func,
    resetPayment: PropTypes.func,
    setPaymentError: PropTypes.func
};

export default ElectionForm;