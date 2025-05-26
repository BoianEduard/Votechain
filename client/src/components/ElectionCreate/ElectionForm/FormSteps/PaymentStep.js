import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import NavigationButton from "../../../Commons/NavigationButton";
import PaymentForm from "../PaymentForm";
import LoadingSpinner from "../../../Commons/LoadingSpinner";
import * as paymentThunks from "../../../../redux/thunks/paymentThunks";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const PaymentStep = ({
                         prevStep,
                         onPaymentSuccess,
                         formData,
                         loading,
                         // Use the payment flow props passed from parent
                         paymentId,
                         paymentCompleted,
                         paymentError,
                         processingPayment,
                         onPaymentStart,
                         onPaymentSuccessHook,
                         onPaymentError,
                         resetPayment,
                         setPaymentError
                     }) => {
    const dispatch = useDispatch();
    const { verifyPayment: verifyPaymentState = {} } = useSelector(state => state.payment || {});

    const [creatingElection, setCreatingElection] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const maxRetries = 3;

    // Reset states when form changes
    useEffect(() => {
        resetPayment();
        setRetryCount(0);
        setCreatingElection(false);
    }, [formData.title, resetPayment]);

    const handlePaymentSuccess = async (paymentIntentId) => {
        try {
            // Update payment flow state
            onPaymentSuccessHook(paymentIntentId);

            // Start election creation
            setCreatingElection(true);

            // Verify payment first
            const verificationResult = await dispatch(paymentThunks.verifyPayment(paymentIntentId));

            if (verificationResult.status !== 'succeeded') {
                throw new Error('Payment was not completed successfully');
            }

            // Payment verified, now create the election
            await onPaymentSuccess(paymentIntentId);
        } catch (error) {
            console.error("Election creation failed:", error);
            const errorMessage = error.message || "Failed to create election after payment";
            setPaymentError(errorMessage);
            setCreatingElection(false);

            // Offer retry option
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

        setCreatingElection(true);
        setPaymentError("");

        try {
            // Re-verify payment before retry
            const verificationResult = await dispatch(paymentThunks.verifyPayment(paymentId));

            if (verificationResult.status !== 'succeeded') {
                throw new Error('Payment verification failed on retry');
            }

            await onPaymentSuccess(paymentId);
        } catch (error) {
            console.error("Retry failed:", error);
            setPaymentError(error.message || "Retry failed");
            setCreatingElection(false);
            setRetryCount(prev => prev + 1);
        }
    };

    const handleResetPayment = () => {
        resetPayment();
        setRetryCount(0);
        setCreatingElection(false);
    };

    return (
        <div className="form-step">
            <div className="max-w-2xl mx-auto">
                {/* Loading Overlay for Election Creation */}
                {creatingElection && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                        <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
                            <div className="text-4xl mb-4">🗳️</div>
                            <LoadingSpinner message="Creating your election..." />
                            <p className="text-gray-600 mt-4">
                                Setting up your secure election...
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                This may take a few moments
                            </p>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Complete Payment
                    </h2>
                    <p className="text-gray-600">
                        Deploy your election: <strong>{formData.title}</strong>
                    </p>
                    <div className="mt-2 text-lg font-semibold text-green-600">
                        $29.99 deployment fee
                    </div>
                </div>

                {/* Payment Form or Success/Error State */}
                {!paymentCompleted ? (
                    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
                        <Elements stripe={stripePromise}>
                            <PaymentForm
                                onPaymentSuccess={handlePaymentSuccess}
                                onPaymentError={handlePaymentError}
                                loading={processingPayment}
                                formData={formData}
                            />
                        </Elements>
                    </div>
                ) : paymentError ? (
                    /* Payment succeeded but election creation failed */
                    <div className="space-y-4 mb-6">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-start">
                                <span className="text-yellow-500 text-xl mr-3 mt-1">⚠️</span>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-yellow-800 mb-2">
                                        Payment Successful, Election Creation Failed
                                    </h3>
                                    <p className="text-yellow-700 mb-3">
                                        Your payment was processed successfully, but there was an issue creating your election.
                                    </p>
                                    <div className="bg-white rounded p-2 mb-3">
                                        <p className="font-mono text-xs text-gray-600">
                                            Payment ID: {paymentId}
                                        </p>
                                    </div>
                                    <p className="text-sm text-yellow-700 mb-3">
                                        Error: {paymentError}
                                    </p>

                                    {retryCount < maxRetries ? (
                                        <div className="flex space-x-3">
                                            <button
                                                onClick={handleRetryElectionCreation}
                                                disabled={verifyPaymentState.loading}
                                                className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 text-white px-4 py-2 rounded font-medium transition-colors flex items-center"
                                            >
                                                {verifyPaymentState.loading ? (
                                                    <>
                                                        <LoadingSpinner size="sm" />
                                                        <span className="ml-2">Verifying...</span>
                                                    </>
                                                ) : (
                                                    `Retry Election Creation (${maxRetries - retryCount} attempts left)`
                                                )}
                                            </button>
                                            <button
                                                onClick={handleResetPayment}
                                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded font-medium transition-colors"
                                            >
                                                Try Different Payment
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="text-sm text-yellow-700">
                                            <p className="mb-2">Maximum retry attempts reached.</p>
                                            <p>Please contact support with your payment ID: <code className="bg-white px-1 rounded">{paymentId}</code></p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Payment and election creation successful */
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center mb-6 shadow-sm">
                        <div className="text-4xl mb-3">✅</div>
                        <h3 className="text-xl font-bold text-green-800 mb-3">
                            Payment Successful!
                        </h3>
                        <div className="bg-white rounded p-3 mb-3 inline-block shadow-sm">
                            <p className="font-mono text-sm text-green-700">
                                Payment ID: {paymentId}
                            </p>
                        </div>
                        <p className="text-green-700 font-medium">
                            Your election is being deployed!
                        </p>
                        <p className="text-sm text-green-600 mt-2">
                            You will be redirected to your dashboard shortly.
                        </p>
                    </div>
                )}

                {/* Election Summary */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-gray-800 mb-3">Election Summary</h4>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Title:</span>
                            <span className="font-medium">{formData.title}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Candidates:</span>
                            <span className="font-medium">{formData.candidates.length}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Start Date:</span>
                            <span className="font-medium">
                                {formData.startDate ? new Date(formData.startDate).toLocaleDateString() : 'Not set'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">End Date:</span>
                            <span className="font-medium">
                                {formData.endDate ? new Date(formData.endDate).toLocaleDateString() : 'Not set'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Eligibility:</span>
                            <span className="font-medium capitalize">{formData.eligibilityType}</span>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center">
                    <NavigationButton
                        title="Back"
                        direction="left"
                        onClick={prevStep}
                        disabled={paymentCompleted || creatingElection || processingPayment}
                    />

                    {paymentCompleted && !creatingElection && !paymentError && (
                        <div className="text-green-600 font-medium flex items-center">
                            <span className="text-xl mr-2">🎉</span>
                            Complete!
                        </div>
                    )}
                </div>

                {/* Support Information */}
                <div className="mt-6 text-center text-xs text-gray-500">
                    <p>Having issues? Contact support with your payment ID for assistance.</p>
                </div>
            </div>
        </div>
    );
};

PaymentStep.propTypes = {
    prevStep: PropTypes.func.isRequired,
    onPaymentSuccess: PropTypes.func.isRequired,
    formData: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    // Payment flow props
    paymentId: PropTypes.string.isRequired,
    paymentCompleted: PropTypes.bool.isRequired,
    paymentError: PropTypes.string.isRequired,
    processingPayment: PropTypes.bool.isRequired,
    onPaymentStart: PropTypes.func.isRequired,
    onPaymentSuccessHook: PropTypes.func.isRequired,
    onPaymentError: PropTypes.func.isRequired,
    resetPayment: PropTypes.func.isRequired,
    setPaymentError: PropTypes.func.isRequired,
};

export default PaymentStep;