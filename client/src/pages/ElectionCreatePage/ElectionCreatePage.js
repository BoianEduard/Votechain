import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useElectionForm } from "../../hooks/ElectionCreateHook/useElectionForm";
import { useFormValidation } from "../../hooks/ElectionCreateHook/useElectionFormValidation";
import { useFormNavigation } from "../../hooks/ElectionCreateHook/useFormNavigation";
import { usePaymentFlow } from "../../hooks/ElectionCreateHook/useElectionPayment";
import { useElectionCreation } from "../../hooks/ElectionCreateHook/useElectionCreation";
import ElectionForm from "../../components/ElectionCreate/ElectionForm";
import Error from "../../components/Commons/Error";
import SuccessMessage from "../../components/Commons/Success";
import ElectionPageHeader from "../../components/Commons/ElectionPageHeader";
import './ElectionCreate.css';

const ElectionCreatePage = () => {
  const navigate = useNavigate();

  // Custom hooks
  const {
    form,
    handleInputChange,
    handleCandidateChange,
    handleCandidateImageChange,
    addCandidate,
    removeCandidate,
    resetForm
  } = useElectionForm();

  const {
    validationErrors,
    validateStep,
    clearValidationErrors,
  } = useFormValidation();

  const {
    step,
    nextStep,
    prevStep,
    resetToFirstStep
  } = useFormNavigation(6);

  const {
    paymentId,
    paymentCompleted,
    paymentError,
    processingPayment,
    handlePaymentStart,
    handlePaymentSuccess: onPaymentSuccessHook,
    handlePaymentError,
    resetPayment
  } = usePaymentFlow();

  const {
    loading,
    error,
    success,
    electionId,
    createElection,
    clearMessages
  } = useElectionCreation();

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate("/dashboard");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  useEffect(() => {
    if (error) {
      clearMessages();
    }
  }, [form, error, clearMessages]);

  const handleStepValidation = () => {
    clearValidationErrors();
    return validateStep(step, form);
  };

  const handleNextStep = () => {
    if (handleStepValidation()) {
      nextStep();
    }
  };

  const handleReset = () => {
    resetForm();
    resetToFirstStep();
    clearMessages();
    resetPayment();
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
  };

  const handlePaymentSuccess = async (paymentIntentId) => {
    try {
      // First, call the payment success hook
      onPaymentSuccessHook(paymentIntentId);

      // Then create the election using our custom hook
      const result = await createElection(form);

      if (!result.success) {
        handlePaymentError(result.error);
      }
    } catch (error) {
      handlePaymentError(error.message || "Failed to create election");
    }
  };

  // Combine all errors for display
  const allErrors = [
    error,
    paymentError,
    ...Object.values(validationErrors)
  ].filter(Boolean);

  return (
      <div className="bg-gradient-to-b from-indigo-700 to-indigo-500" style={{ maxHeight: 'calc(100vh - 630px)' }}>
        <div className="pt-10 pb-10 px-4">
          <ElectionPageHeader
              title="Create New Election"
              description="Set up a secure, blockchain-based election"
              backLink="/dashboard"
              backLabel="Back to Dashboard"
          />
        </div>

        <div className="px-4 pb-8">
          {allErrors.length > 0 && (
              <div className="mb-6 space-y-2">
                {allErrors.map((errorMsg, index) => (
                    <Error key={index} error={errorMsg} />
                ))}
              </div>
          )}
          {success && (
              <div className="mb-6">
                <SuccessMessage message={success} />
              </div>
          )}
        </div>

        <ElectionForm
            formData={form}
            handleInputChange={handleInputChange}
            handleCandidateChange={handleCandidateChange}
            handleCandidateImageChange={handleCandidateImageChange}
            addCandidate={addCandidate}
            removeCandidate={removeCandidate}
            handleSubmit={handleFormSubmit}
            loading={loading}
            error={error}
            step={step}
            nextStep={handleNextStep}
            prevStep={prevStep}
            onReset={handleReset}
            electionId={electionId}

            // Payment flow props
            paymentId={paymentId}
            paymentCompleted={paymentCompleted}
            paymentError={paymentError}
            processingPayment={processingPayment}
            onPaymentStart={handlePaymentStart}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
            resetPayment={resetPayment}
        />
      </div>
  );
};

export default ElectionCreatePage;