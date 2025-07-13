import React, { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import LoadingSpinner from "../../Commons/LoadingSpinner";
import Error from "../../Commons/Error";
import FormContainer from "../../../hooks/ElectionCreateHook/useExpandableSection";
import InputSection from "../FormComponents/InputSection";
import { formatPrice } from "../../../utils/pricing";
import * as paymentThunks from "../../../redux/thunks/paymentThunks";

const PaymentForm = ({
                         formData,
                         pricingData,
                         onPaymentSuccess,
                         onPaymentError,
                         onProcessingChange,
                     }) => {
    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch();

    const [processingPayment, setProcessingPayment] = useState(false);
    const [paymentError, setPaymentError] = useState(null);

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

    const updateProcessingState = (isProcessing) => {
        setProcessingPayment(isProcessing);
        onProcessingChange?.(isProcessing);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            const error = "Payment system is not ready. Please try again.";
            setPaymentError(error);
            onPaymentError(new Error(error));
            return;
        }

        if (!pricingData) {
            const error = "Price calculation is not ready. Please try again.";
            setPaymentError(error);
            onPaymentError(new Error(error));
            return;
        }

        try {
            setPaymentError(null);
            updateProcessingState(true);

            const paymentIntentData = await dispatch(
                paymentThunks.createPaymentIntent({
                    amount: pricingData.totalCents,
                    currency: "usd",
                    metadata: {
                        electionTitle: formData.title,
                        candidateCount: formData.candidates.length,
                        eligibilityType: formData.eligibilityType,
                        voterCount: pricingData.voterCount,
                        basePrice: pricingData.basePrice,
                        pricePerVoter: pricingData.pricePerVoter,
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
                onPaymentSuccess(paymentIntent.id);
            } else {
                throw new Error("Payment was not completed successfully");
            }
        } catch (err) {
            console.error("Payment error:", err);
            const errorMessage = err.message || "An unexpected error occurred. Please try again.";
            setPaymentError(errorMessage);
            onPaymentError(err);
        } finally {
            updateProcessingState(false);
        }
    };

    if (!pricingData) {
        return (
            <FormContainer className="p-0">
                <div className="flex items-center justify-center py-8">
                    <LoadingSpinner message="Calculating price..." />
                </div>
            </FormContainer>
        );
    }

    return (
        <FormContainer className="p-0">
            <form onSubmit={handleSubmit} className="space-y-3">
                <InputSection title="Order Summary" icon="💳">
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Base Election Fee</span>
                            <span className="font-medium">${formatPrice(pricingData.basePrice * 100)}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-600">
                                Voter Fee ({pricingData.voterCount} voters × ${formatPrice(pricingData.pricePerVoter * 100)})
                            </span>
                            <span className="font-medium">
                                ${formatPrice((pricingData.voterCount * pricingData.pricePerVoter) * 100)}
                            </span>
                        </div>

                        <div className="border-t pt-2">
                            <div className="flex justify-between font-bold text-base">
                                <span>Total</span>
                                <span>${formatPrice(pricingData.totalCents)}</span>
                            </div>
                        </div>
                    </div>
                </InputSection>

                <InputSection title="Card Details" icon="🔒">
                    <div className="border border-gray-300 rounded p-3 bg-white">
                        <CardElement options={cardElementOptions} />
                    </div>
                </InputSection>

                {paymentError && <Error error = {paymentError}  />}

                {}

                <button
                    type="submit"
                    disabled={!stripe || processingPayment}
                    className={`w-full py-2 px-4 rounded text-sm font-medium transition-colors ${
                        !stripe || processingPayment
                            ? "bg-gray-300 cursor-not-allowed text-gray-500"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                >
                    {processingPayment ? (
                        <div className="flex items-center justify-center">
                            <span className="ml-1">Processing...</span>
                        </div>
                    ) : (
                        `Pay $${formatPrice(pricingData.totalCents)}`
                    )}
                </button>

                <p className="text-xs text-gray-500 text-center">
                    Stripe
                </p>
            </form>
        </FormContainer>
    );
};

PaymentForm.propTypes = {
    formData: PropTypes.shape({
        title: PropTypes.string,
        candidates: PropTypes.array,
        eligibilityType: PropTypes.string,
    }).isRequired,
    pricingData: PropTypes.shape({
        totalCents: PropTypes.number.isRequired,
        totalDollars: PropTypes.number.isRequired,
        basePrice: PropTypes.number.isRequired,
        pricePerVoter: PropTypes.number.isRequired,
        voterCount: PropTypes.number.isRequired,
    }),
    onPaymentSuccess: PropTypes.func.isRequired,
    onPaymentError: PropTypes.func.isRequired,
    onProcessingChange: PropTypes.func,
};

export default PaymentForm;