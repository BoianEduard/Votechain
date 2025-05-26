import * as paymentSlice from "../slices/paymentSlice";
import paymentAPI from "../../api/paymentAPI";

export const createPaymentIntent = (paymentDetails) => async (dispatch) => {
    dispatch(paymentSlice.createPaymentStart());
    try {
        const data = await paymentAPI.createPaymentIntent(paymentDetails);
        dispatch(paymentSlice.createPaymentSuccess(data));
        return data;
    } catch (error) {
        const serializedError = {
            message: error.message || "Payment intent creation failed",
            code: error.code,
            status: error.response?.status,
        };
        dispatch(paymentSlice.createPaymentFail(serializedError));
        throw error;
    }
};

export const verifyPayment = (paymentIntentId) => async (dispatch) => {
    dispatch(paymentSlice.verifyPaymentStart());
    try {
        const data = await paymentAPI.verifyPayment(paymentIntentId);
        dispatch(paymentSlice.verifyPaymentSuccess(data));
        return data;
    } catch (error) {
        const serializedError = {
            message: error.message || "Payment verification failed",
            code: error.code,
            status: error.response?.status,
        };
        dispatch(paymentSlice.verifyPaymentFail(serializedError));
        throw error;
    }
};

export const refundPayment = (refundData) => async (dispatch) => {
    dispatch(paymentSlice.refundPaymentStart());
    try {
        const data = await paymentAPI.refundPayment(refundData);
        dispatch(paymentSlice.refundPaymentSuccess(data));
        return data;
    } catch (error) {
        const serializedError = {
            message: error.message || "Refund processing failed",
            code: error.code,
            status: error.response?.status,
        };
        dispatch(paymentSlice.refundPaymentFail(serializedError));
        throw error;
    }
};