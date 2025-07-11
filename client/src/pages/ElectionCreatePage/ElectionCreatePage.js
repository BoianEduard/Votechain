import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useElectionForm } from "../../hooks/ElectionCreateHook/useElectionForm";
import { useFormValidation } from "../../hooks/ElectionCreateHook/useElectionFormValidation";
import { useFormNavigation } from "../../hooks/ElectionCreateHook/useFormNavigation";
import { usePaymentFlow } from "../../hooks/ElectionCreateHook/useElectionPayment";
import { useElectionCreation } from "../../hooks/ElectionCreateHook/useElectionCreation";
import ElectionForm from "../../components/ElectionCreate/ElectionForm";
import ProgressTracker from "../../components/ElectionCreate/FormSteps/ProgressTracker";
import Error from "../../components/Commons/Error";
import SuccessMessage from "../../components/Commons/Success";
import ElectionPageHeader from "../../components/Commons/ElectionPageHeader";
import './ElectionCreate.css';

const ElectionCreatePage = () => {
  const navigate = useNavigate();

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
    clearMessages,
    clearFinalizing,
    stopLoading
  } = useElectionCreation();

  const isBusy = loading || processingPayment;

  useEffect(() => {
  }, [paymentCompleted]);

  useEffect(() => {
    if (success) {
      stopLoading();
      const timer = setTimeout(() => {
        navigate("/dashboard");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate, stopLoading]);


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

  const handlePaymentSuccess = async (paymentIntentId, electionFee) => {
    try {
      onPaymentSuccessHook(paymentIntentId);
      await createElection(form, electionFee);
    } catch (error) {
      handlePaymentError(error.message || "Failed to create election");
    }
  };

  const allErrors = [
    error,
    paymentError,
    ...Object.values(validationErrors)
  ].filter(Boolean);

  return (
      <div className="min-h-screen bg-gradient-to-b from-purple-600 via-indigo-800 to-blue-500">
        <div className="pt-10 pb-2 px-2">
          <ElectionPageHeader
              title="Create New Election"
              description="Set up a secure, blockchain-based election"
              backLink="/dashboard"
              backLabel="Back to Dashboard"
          />
           <ProgressTracker currentStep={step} />
        </div>

        <div className="bg-white dark:bg-gray-900 min-h-screen rounded-t-3xl px-4 py-4 transition-colors duration-200">
          <div className="max-w-4xl mx-auto">
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

            <ElectionForm
                formData={form}
                handleInputChange={handleInputChange}
                handleCandidateChange={handleCandidateChange}
                handleCandidateImageChange={handleCandidateImageChange}
                addCandidate={addCandidate}
                removeCandidate={removeCandidate}
                handleSubmit={handleFormSubmit}
                loading={isBusy}
                error={error}
                step={step}
                nextStep={handleNextStep}
                prevStep={prevStep}
                onReset={handleReset}
                electionId={electionId}
                success={success}

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
        </div>
      </div>
  );
};

export default ElectionCreatePage;