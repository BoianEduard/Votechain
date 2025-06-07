import React from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import LoadingSpinner from "../../Commons/LoadingSpinner";
import Error from "../../Commons/Error";
import SuccessMessage from "../../Commons/Success";
import { usePaymentFlow } from "../../../hooks/ElectionCreateHook/useElectionPayment";
import * as paymentThunks from "../../../redux/thunks/paymentThunks";

const OrderSummary = ({ title }) => (
    <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <h4 className="font-semibold text-gray-800 mb-2">Order Summary</h4>
        <div className="flex justify-between items-center text-sm text-gray-600 mb-1">
            <span>Election Deployment Fee</span>
            <span>$29.99</span>
        </div>
        <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
            <span>Election: {title || "Untitled Election"}</span>
        </div>
        <div className="border-t pt-2 flex justify-between items-center font-semibold">
            <span>Total</span>
            <span>$29.99</span>
        </div>
    </div>
);

const CardInput = ({ options }) => (
    <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
            Card Details
        </label>
        <div className="relative">
            <div className="border-2 border-gray-200 rounded-xl p-4 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all duration-200 bg-white">
                <CardElement options={options} />
            </div>
        </div>
    </div>
);

const PaymentForm = ({ onPaymentSuccess, onPaymentError, loading, formData }) => {
    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch();

    const {
        processingPayment,
        paymentError,
        handlePaymentStart,
        handlePaymentSuccess,
        handlePaymentError,
        resetPayment,
    } = usePaymentFlow();

    const cardElementOptions = {
        style: {
            base: {
                fontSize: "16px",
                color: "#374151",
                fontFamily: '"Inter", system-ui, sans-serif',
                "::placeholder": { color: "#9CA3AF" },
                padding: "12px 16px",
            },
            invalid: { color: "#EF4444", iconColor: "#EF4444" },
            complete: { color: "#059669", iconColor: "#059669" },
        },
        hidePostalCode: false,
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            handlePaymentError("Payment system is not ready. Please try again.");
            return;
        }

        try {
            handlePaymentStart();

            const paymentIntentData = await dispatch(
                paymentThunks.createPaymentIntent({
                    amount: 2999,
                    currency: "usd",
                    metadata: {
                        electionTitle: formData.title,
                        candidateCount: formData.candidates.length,
                        eligibilityType: formData.eligibilityType,
                    },
                })
            );

            const { clientSecret, paymentIntentId } = paymentIntentData;

            const cardElement = elements.getElement(CardElement);
            const { error, paymentIntent } = await stripe.confirmCardPayment(
                clientSecret,
                {
                    payment_method: {
                        card: cardElement,
                        billing_details: { name: formData.title },
                    },
                }
            );

            if (error) {
                throw error;
            }

            if (paymentIntent.status === "succeeded") {
                handlePaymentSuccess(paymentIntent.id);
                onPaymentSuccess(paymentIntent.id);
            } else {
                throw new Error("Payment was not completed successfully");
            }
        } catch (err) {
            console.error("Payment error:", err);
            handlePaymentError(err.message || "An unexpected error occurred. Please try again.");
            onPaymentError(err);
        }
    };

    const displayError = paymentError;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <span className="text-2xl mr-3">💳</span>
                    Payment Information
                </h3>
                <div className="space-y-4">
                    <OrderSummary title={formData.title} />
                    <CardInput options={cardElementOptions} />
                    {displayError && <Error message={displayError} />}
                </div>
            </div>

            <div className="pt-3">
                <button
                    type="submit"
                    disabled={
                        !stripe ||
                        processingPayment ||
                        loading
                    }
                    className={`w-full flex items-center justify-center px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 ${
                        !stripe || processingPayment || loading
                            ? "bg-gray-300 cursor-not-allowed text-gray-500"
                            : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    }`}
                >
                    {processingPayment ? (
                        <>
                            <LoadingSpinner size="sm" />
                            <span className="ml-2">Processing payment..</span>
                        </>
                    ) : (
                        <>
                            <span className="text-xl mr-2">💰</span>
                            <span>Pay $29.99 & Create Election</span>
                        </>
                    )}
                </button>
            </div>

            <div className="text-center space-y-2">
                <div className="flex items-center justify-center text-xs text-gray-500">
                    <span className="mr-1">🔒</span>
                    <span>Secured by Stripe • Your payment information is encrypted</span>
                </div>
                <p className="text-xs text-gray-500">
                    By completing this payment, you agree to our terms of service. Your
                    election will be deployed immediately after successful payment.
                </p>
            </div>
        </form>
    );
};

PaymentForm.propTypes = {
    onPaymentSuccess: PropTypes.func.isRequired,
    onPaymentError: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    formData: PropTypes.shape({
        title: PropTypes.string,
        candidates: PropTypes.array,
        eligibilityType: PropTypes.string,
    }).isRequired,
};

export default PaymentForm;