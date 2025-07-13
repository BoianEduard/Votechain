import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import NavigationButton from "../../Commons/NavigationButton";
import PaymentForm from "../ElectionForm/PaymentForm";
import LoadingSpinner from "../../Commons/LoadingSpinner";
import FormContainer from "../../../hooks/ElectionCreateHook/useExpandableSection";
import InputSection from "../FormComponents/InputSection";
import * as paymentThunks from "../../../redux/thunks/paymentThunks";
import { useVoterCount } from "../../../hooks/ElectionCreateHook/useVoterCount";
import { calculateElectionPrice } from "../../../utils/pricing";
import Error from "../../Commons/Error";
import SuccessMessage from "../../Commons/Success";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const PaymentStep = ({
                         formData,
                         prevStep,
                         onPaymentSuccess,
                         loading,
                         paymentCompleted,
                         paymentError,
                         resetPayment,
                     }) => {
    const dispatch = useDispatch();
    const [pricingData, setPricingData] = useState(null);
    const [processingPayment, setProcessingPayment] = useState(false);
    const [paymentId, setPaymentId] = useState(null);
    const [paymentProcessingError, setPaymentProcessingError] = useState(null);

    const { calculateVoterCount, voterCountLoading } = useVoterCount();

    useEffect(() => {
        const calculatePricing = async () => {
            try {
                const voterCount = await calculateVoterCount(formData);
                const pricing = calculateElectionPrice(voterCount);
                setPricingData(pricing);
            } catch (error) {
                console.error("Error calculating pricing:", error);
                setPricingData(calculateElectionPrice(0));
            }
        };

        calculatePricing();
    }, [formData, calculateVoterCount]);

    const handlePaymentSuccess = async (paymentIntentId) => {
        try {
            setPaymentProcessingError(null);
            setPaymentId(paymentIntentId);
            const verificationResult = await dispatch(paymentThunks.verifyPayment(paymentIntentId));
            if (verificationResult.status !== 'succeeded') {
                throw new Error('Payment verification failed');
            }
            const voterCount = await calculateVoterCount(formData);
            const pricing = calculateElectionPrice(voterCount);
            await onPaymentSuccess(paymentIntentId, pricing.totalDollars);
        } catch (error) {
            console.error("Election creation failed:", error);
            const errorMessage = error.message || "Failed to create election after payment";
            setPaymentProcessingError(errorMessage);
        }
    };

    const handlePaymentError = (error) => {
        console.error("Payment error:", error);
        setPaymentProcessingError(error.message || "Payment failed");
    };

    const handleResetPayment = () => {
        resetPayment();
        setPaymentProcessingError(null);
        setPaymentId(null);
        setProcessingPayment(false);
    };

    const displayError = paymentError || paymentProcessingError;

    const renderPaymentStatus = () => {
        if (paymentCompleted && !displayError) {
            return (
                <InputSection
                    title="Payment Complete"
                    icon="✅"
                    className="bg-green-50 border border-green-200 rounded-lg p-3"
                >
                    <SuccessMessage message="Payment successful! Election is being deployed." />
                </InputSection>
            );
        }

        if (displayError && paymentCompleted) {
            return (
                <InputSection
                    title="Payment Issue"
                    icon="⚠️"
                    className="bg-red-50 border border-red-200 rounded-lg p-3"
                >
                    <Error message={displayError} />
                    {paymentId && (
                        <div className="text-xs text-gray-600 mt-2">
                            Payment ID: {paymentId}
                        </div>
                    )}
                    <div className="text-sm text-red-700 mt-3">
                        <p>Please contact support for assistance with this payment.</p>
                    </div>
                    <button
                        onClick={handleResetPayment}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium mt-3"
                    >
                        Try New Payment
                    </button>
                </InputSection>
            );
        }

        return null;
    };

    return (
        <FormContainer
            title="Complete Payment"
            maxHeight="calc(100vh - 300px)"
            className="max-w-lg mx-auto p-0"
        >
            {(loading) && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 max-w-sm mx-4 text-center">
                        <LoadingSpinner message="Creating election..." />
                        <p className="text-sm text-gray-600 mt-2">
                            This may take a moment
                        </p>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {voterCountLoading && (
                    <InputSection
                        title="Calculating Price"
                        icon="⏳"
                        className="bg-blue-50 border border-blue-200 rounded-lg p-3"
                    >
                        <div className="flex items-center gap-2">
                            <LoadingSpinner size="sm" />
                            <span className="text-sm text-blue-700">Calculating voter count...</span>
                        </div>
                    </InputSection>
                )}

                {!paymentCompleted ? (
                    <Elements stripe={stripePromise}>
                        <PaymentForm
                            formData={formData}
                            pricingData={pricingData}
                            onPaymentSuccess={handlePaymentSuccess}
                            onPaymentError={handlePaymentError}
                            onProcessingChange={setProcessingPayment}
                        />
                    </Elements>
                ) : (
                    renderPaymentStatus()
                )}

                <div className="flex justify-between pt-4 border-t">
                    <NavigationButton
                        title="Back"
                        direction="left"
                        onClick={prevStep}
                        disabled={paymentCompleted || processingPayment}
                    />

                    {paymentCompleted && !displayError && (
                        <div className="text-green-600 font-medium text-sm">
                            ✅ Payment Complete
                        </div>
                    )}
                </div>
            </div>
        </FormContainer>
    );
};

PaymentStep.propTypes = {
    formData: PropTypes.object.isRequired,
    prevStep: PropTypes.func.isRequired,
    onPaymentSuccess: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    paymentCompleted: PropTypes.bool,
    paymentError: PropTypes.string,
    resetPayment: PropTypes.func,
};

export default PaymentStep;