import React, { useState } from "react";
import {CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import PropTypes from "prop-types";
import LoadingSpinner from "../../Commons/LoadingSpinner";

const PaymentForm = ({ onPaymentSuccess, onPaymentError, loading }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [processing, setProcessing] = useState(false);
    const [paymentError, setPaymentError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setProcessing(true);
        setPaymentError("");

        const cardElement = elements.getElement(CardElement);

        try {
            // Create payment method
            const { error, paymentMethod } = await stripe.createPaymentMethod({
                type: "card",
                card: cardElement,
            });

            if (error) {
                setPaymentError(error.message);
                setProcessing(false);
                return;
            }

            // Call your backend to create payment intent and process payment
            const response = await fetch("/api/payments/create-payment-intent", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    paymentMethodId: paymentMethod.id,
                    amount: 2999, // $29.99 in cents
                    currency: "usd",
                }),
            });

            const paymentResult = await response.json();

            if (paymentResult.error) {
                setPaymentError(paymentResult.error);
                setProcessing(false);
                return;
            }

            // Confirm payment if required
            if (paymentResult.requiresAction) {
                const { error: confirmError } = await stripe.confirmCardPayment(
                    paymentResult.clientSecret
                );

                if (confirmError) {
                    setPaymentError(confirmError.message);
                    setProcessing(false);
                    return;
                }
            }

            onPaymentSuccess(paymentResult.paymentIntentId);
        } catch (error) {
            setPaymentError("An unexpected error occurred. Please try again.");
            onPaymentError(error.message);
        } finally {
            setProcessing(false);
        }
    };

    const cardElementOptions = {
        style: {
            base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                    color: "#aab7c4",
                },
                padding: "12px",
            },
            invalid: {
                color: "#9e2146",
            },
        },
        hidePostalCode: false,
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Card Details
                        </label>
                        <div className="border border-gray-300 rounded-md p-3">
                            <CardElement options={cardElementOptions} />
                        </div>
                    </div>
                    {paymentError && (
                        <div className="text-red-600 text-sm">{paymentError}</div>
                    )}
                </div>
            </div>

            <div className="flex justify-center">
                <button
                    type="submit"
                    disabled={!stripe || processing || loading}
                    className={`flex items-center px-8 py-3 rounded-md font-medium transition-all duration-200 ${
                        !stripe || processing || loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700 hover:shadow-lg transform hover:-translate-y-0.5"
                    } text-white`}
                >
                    {processing ? (
                        <>
                            <LoadingSpinner size="sm" />
                            <span className="ml-2">Processing...</span>
                        </>
                    ) : (
                        `Pay $29.99`
                    )}
                </button>
            </div>
        </form>
    );
};



PaymentForm.propTypes = {
    onPaymentSuccess: PropTypes.func.isRequired,
    onPaymentError: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
};

export default PaymentForm;