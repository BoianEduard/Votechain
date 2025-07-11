import { useState } from 'react';
import React, { useEffect } from "react";

export const usePaymentFlow = () => {
    const [paymentId, setPaymentId] = useState("");
    const [paymentCompleted, setPaymentCompleted] = useState(false);
    const [paymentError, setPaymentError] = useState("");
    const [processingPayment, setProcessingPayment] = useState(false);

    useEffect(() => {
        if (paymentCompleted) {
            console.log("Payment completed updated:", paymentCompleted);
        }
    }, [paymentCompleted]);

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

    const isBusy = processingPayment;
    return {
        paymentId,
        paymentCompleted,
        paymentError,
        processingPayment,
        isBusy,
        handlePaymentStart,
        handlePaymentSuccess,
        handlePaymentError,
        resetPayment,
        setPaymentError
    };
};