
import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js";
import PropTypes from "prop-types";
import NavigationButton from "../../../Commons/NavigationButton";
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const PaymentStep = ({ nextStep, prevStep, onPaymentSuccess }) => {
    const [paymentCompleted, setPaymentCompleted] = useState(false);
    const [paymentId, setPaymentId] = useState("");
    const [loading, setLoading] = useState(false);

    const handlePaymentSuccess = (paymentIntentId) => {
        setPaymentCompleted(true);
        setPaymentId(paymentIntentId);
        onPaymentSuccess(paymentIntentId);
    };

    const handlePaymentError = (error) => {
        console.error("Payment error:", error);
        setLoading(false);
    };

    const handleContinue = () => {
        if (paymentCompleted) {
            nextStep();
        }
    };

    return (
        <div className="form-step">
            <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    💳 Payment Required
                </h2>

                {/* Pricing Information */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-6">
                    <div className="text-center">
                        <h3 className="text-xl font-semibold text-blue-900 mb-2">
                            Election Creation Fee
                        </h3>
                        <div className="text-3xl font-bold text-blue-600 mb-2">$29.99</div>
                        <p className="text-sm text-blue-700">
                            One-time fee for blockchain deployment and secure election hosting
                        </p>
                    </div>

                    <div className="mt-4 space-y-2 text-sm text-blue-800">
                        <div className="flex items-center">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                            Secure blockchain contract deployment
                        </div>
                        <div className="flex items-center">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                            Unlimited voters (based on eligibility settings)
                        </div>
                        <div className="flex items-center">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                            Real-time results and analytics
                        </div>
                        <div className="flex items-center">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                            24/7 technical support
                        </div>
                    </div>
                </div>

                {!paymentCompleted ? (
                    <Elements stripe={stripePromise}>
                        <PaymentForm
                            onPaymentSuccess={handlePaymentSuccess}
                            onPaymentError={handlePaymentError}
                            loading={loading}
                        />
                    </Elements>
                ) : (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                        <div className="text-green-600 text-4xl mb-4">✅</div>
                        <h3 className="text-lg font-semibold text-green-800 mb-2">
                            Payment Successful!
                        </h3>
                        <p className="text-green-700 mb-4">
                            Payment ID: {paymentId}
                        </p>
                        <p className="text-sm text-green-600">
                            You can now proceed to create your election.
                        </p>
                    </div>
                )}

                {/* Navigation */}
                <div className="form-actions mt-8 flex justify-between items-center">
                    <NavigationButton
                        title="Back: Settings"
                        direction="left"
                        onClick={prevStep}
                    />
                    {paymentCompleted && (
                        <NavigationButton
                            title="Continue: Review"
                            direction="right"
                            onClick={handleContinue}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

PaymentStep.propTypes = {
    nextStep: PropTypes.func.isRequired,
    prevStep: PropTypes.func.isRequired,
    onPaymentSuccess: PropTypes.func.isRequired,
};

PaymentForm.propTypes = {
    onPaymentSuccess: PropTypes.func.isRequired,
    onPaymentError: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
};

export default PaymentStep;
