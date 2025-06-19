import * as paymentSlice from "../slices/paymentSlice";
import paymentAPI from "../../api/paymentAPI";
import serializeError from '../../utils/serializeError';

export const createPaymentIntent = (paymentDetails) => async (dispatch) => {
    dispatch(paymentSlice.createPaymentStart());
    try {
        const data = await paymentAPI.createPaymentIntent(paymentDetails);
        dispatch(paymentSlice.createPaymentSuccess(data));
        return data;
    } catch (error) {
        const serializedError = serializeError(error, "Payment intent creation failed");
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
        const serializedError = serializeError(error, "Payment verification failed");
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
        const serializedError = serializeError(error, "Refund processing failed");
        dispatch(paymentSlice.refundPaymentFail(serializedError));
        throw error;
    }
};