import React from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import LoadingSpinner from "../../Commons/LoadingSpinner";
import Error from "../../Commons/Error";
import FormContainer from "../../../hooks/ElectionCreateHook/useExpandableSection";
import InputSection from "../FormComponents/InputSection";
import { usePaymentFlow } from "../../../hooks/ElectionCreateHook/useElectionPayment";
import * as paymentThunks from "../../../redux/thunks/paymentThunks";

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
    } = usePaymentFlow();

    const cardElementOptions = {
        style: {
            base: {
                fontSize: "14px",
                color: "#374151",
                fontFamily: '"Inter", system-ui, sans-serif',
                "::placeholder": { color: "#9CA3AF" },
            },
            invalid: { color: "#EF4444" },
            complete: { color: "#059669" },
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
                    amount: 150,
                    currency: "usd",
                    metadata: {
                        electionTitle: formData.title,
                        candidateCount: formData.candidates.length,
                        eligibilityType: formData.eligibilityType,
                    },
                })
            );

            const { clientSecret } = paymentIntentData;
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

    return (
        <FormContainer className="p-0">
            <form onSubmit={handleSubmit} className="space-y-3">
                <InputSection title="Order Summary" icon="💳">
                    <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Election Deployment</span>
                            <span className="font-medium">$1.50</span>
                        </div>
                        <div className="text-xs text-gray-500">
                            {formData.title || "Untitled Election"}
                        </div>
                    </div>
                </InputSection>

                <InputSection title="Card Details" icon="🔒">
                    <div className="border border-gray-300 rounded p-3 bg-white">
                        <CardElement options={cardElementOptions} />
                    </div>
                </InputSection>

                {paymentError && <Error message={paymentError} />}

                <button
                    type="submit"
                    disabled={!stripe || processingPayment || loading}
                    className={`w-full py-2 px-4 rounded text-sm font-medium transition-colors ${
                        !stripe || processingPayment || loading
                            ? "bg-gray-300 cursor-not-allowed text-gray-500"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                >
                    {processingPayment ? (
                        <div className="flex items-center justify-center">
                            <LoadingSpinner size="sm" />
                            <span className="ml-2">Processing...</span>
                        </div>
                    ) : (
                        "Pay $29.99"
                    )}
                </button>

                <p className="text-xs text-gray-500 text-center">
                    Secured by Stripe
                </p>
            </form>
        </FormContainer>
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