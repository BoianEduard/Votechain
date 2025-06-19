import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import NavigationButton from "../../Commons/NavigationButton";
import PaymentForm from "../ElectionForm/PaymentForm";
import LoadingSpinner from "../../Commons/LoadingSpinner";
import FormContainer from "../../../hooks/ElectionCreateHook/useExpandableSection";
import InputSection from "../FormComponents/InputSection";
import * as paymentThunks from "../../../redux/thunks/paymentThunks";
import Error from "../../Commons/Error";
import SuccessMessage from "../../Commons/Success";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const PaymentStep = ({
                         prevStep,
                         onPaymentSuccess,
                         formData,
                         loading,
                         paymentId,
                         paymentCompleted,
                         paymentError,
                         processingPayment,
                         onPaymentStart,
                         onPaymentSuccessHook,
                         onPaymentError,
                         resetPayment,
                         setPaymentError,
                         success
                     }) => {
    const dispatch = useDispatch();
    const { verifyPayment: verifyPaymentState = {} } = useSelector(state => state.payment || {});
    const [retryCount, setRetryCount] = useState(0);
    const maxRetries = 3;

    useEffect(() => {
        resetPayment();
        setRetryCount(0);
    }, [formData.title, resetPayment]);

    const handlePaymentSuccess = async (paymentIntentId) => {
        try {
            onPaymentSuccessHook(paymentIntentId);
            const verificationResult = await dispatch(paymentThunks.verifyPayment(paymentIntentId));

            if (verificationResult.status !== 'succeeded') {
                throw new Error('Payment was not completed successfully');
            }

            await onPaymentSuccess(paymentIntentId);
        } catch (error) {
            console.error("Election creation failed:", error);
            const errorMessage = error.message || "Failed to create election after payment";
            setPaymentError(errorMessage);

            if (retryCount < maxRetries) {
                setRetryCount(prev => prev + 1);
            }
        }
    };

    const handlePaymentError = (error) => {
        console.error("Payment error:", error);
        onPaymentError(error);
    };

    const handleRetryElectionCreation = async () => {
        if (!paymentId || retryCount >= maxRetries) return;
        setPaymentError("");

        try {
            const verificationResult = await dispatch(paymentThunks.verifyPayment(paymentId));
            if (verificationResult.status !== 'succeeded') {
                throw new Error('Payment verification failed on retry');
            }
            await onPaymentSuccess(paymentId);
        } catch (error) {
            console.error("Retry failed:", error);
            setPaymentError(error.message || "Retry failed");
            setRetryCount(prev => prev + 1);
        }
    };

    const handleResetPayment = () => {
        resetPayment();
        setRetryCount(0);
    };

    return (
        <FormContainer
            title="Complete Payment"
            maxHeight="calc(100vh - 300px)"
            className="max-w-lg mx-auto p-0"
        >
            {/* Loading Overlay */}
            {(!success && (processingPayment || loading)) && (
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
                {/* Election Info */}

                {/* Payment Form or Status */}
                {!paymentCompleted ? (
                    <Elements stripe={stripePromise}>
                        <PaymentForm
                            onPaymentSuccess={handlePaymentSuccess}
                            onPaymentError={handlePaymentError}
                            loading={processingPayment}
                            formData={formData}
                        />
                    </Elements>
                ) : paymentError ? (
                    /* Error State */
                    <InputSection title="Payment Issue" icon="⚠️" className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <Error message={paymentError} />
                        <div className="text-xs text-gray-600 mt-2">
                            Payment ID: {paymentId}
                        </div>

                        {retryCount < maxRetries ? (
                            <div className="flex gap-2 mt-3">
                                <button
                                    onClick={handleRetryElectionCreation}
                                    disabled={verifyPaymentState.loading}
                                    className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 text-white px-3 py-1 rounded text-sm font-medium"
                                >
                                    {verifyPaymentState.loading ? "Verifying..." : "Retry"}
                                </button>
                                <button
                                    onClick={handleResetPayment}
                                    className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm font-medium"
                                >
                                    New Payment
                                </button>
                            </div>
                        ) : (
                            <div className="text-sm text-yellow-700 mt-2">
                                <p>Maximum retries reached.</p>
                                <p>Contact support with Payment ID: <code>{paymentId}</code></p>
                            </div>
                        )}
                    </InputSection>
                ) : (
                    /* Success State */
                    <InputSection title="Payment Complete" icon="✅" className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <SuccessMessage message="Payment successful! Election is being deployed." />
                        <div className="text-xs text-green-700 mt-2">
                            Payment ID: {paymentId}
                        </div>
                    </InputSection>
                )}

                {/* Navigation */}
                <div className="flex justify-between pt-4 border-t">
                    <NavigationButton
                        title="Back"
                        direction="left"
                        onClick={prevStep}
                        disabled={paymentCompleted || processingPayment}
                    />

                    {paymentCompleted && !paymentError && (
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
    prevStep: PropTypes.func.isRequired,
    onPaymentSuccess: PropTypes.func.isRequired,
    formData: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    paymentId: PropTypes.string.isRequired,
    paymentCompleted: PropTypes.bool.isRequired,
    paymentError: PropTypes.string.isRequired,
    processingPayment: PropTypes.bool.isRequired,
    onPaymentStart: PropTypes.func.isRequired,
    onPaymentSuccessHook: PropTypes.func.isRequired,
    onPaymentError: PropTypes.func.isRequired,
    resetPayment: PropTypes.func.isRequired,
    setPaymentError: PropTypes.func.isRequired,
    success: PropTypes.string,
};

export default PaymentStep;