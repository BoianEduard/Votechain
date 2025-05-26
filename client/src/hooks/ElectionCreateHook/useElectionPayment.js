import { useState } from 'react';

export const usePaymentFlow = () => {
    const [paymentId, setPaymentId] = useState("");
    const [paymentCompleted, setPaymentCompleted] = useState(false);
    const [paymentError, setPaymentError] = useState("");
    const [processingPayment, setProcessingPayment] = useState(false);

    const handlePaymentStart = () => {
        setProcessingPayment(true);
        setPaymentError("");
    };

    const handlePaymentSuccess = (paymentIntentId) => {
        setPaymentId(paymentIntentId);
        setPaymentCompleted(true);
        setProcessingPayment(false);
        setPaymentError("");
    };

    const handlePaymentError = (error) => {
        setPaymentError(error.message || "Payment failed");
        setProcessingPayment(false);
        setPaymentCompleted(false);
    };

    const resetPayment = () => {
        setPaymentId("");
        setPaymentCompleted(false);
        setPaymentError("");
        setProcessingPayment(false);
    };

    return {
        paymentId,
        paymentCompleted,
        paymentError,
        processingPayment,
        handlePaymentStart,
        handlePaymentSuccess,
        handlePaymentError,
        resetPayment,
        setPaymentError
    };
};