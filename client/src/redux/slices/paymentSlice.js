import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    createPayment: {
        loading: false,
        error: null,
        success: false,
        paymentIntentId: null,
        clientSecret: null,
    },
    verifyPayment: {
        loading: false,
        error: null,
        success: false,
        status: null,
        amount: null,
        currency: null,
        metadata: null,
    },
    refundPayment: {
        loading: false,
        error: null,
        success: false,
        refundId: null,
        status: null,
        amount: null,
    },
};

const paymentSlice = createSlice({
    name: "payment",
    initialState,
    reducers: {
        createPaymentStart(state) {
            state.createPayment.loading = true;
            state.createPayment.error = null;
            state.createPayment.success = false;
            state.createPayment.paymentIntentId = null;
            state.createPayment.clientSecret = null;
        },
        createPaymentSuccess(state, action) {
            state.createPayment.loading = false;
            state.createPayment.error = null;
            state.createPayment.success = true;
            state.createPayment.paymentIntentId = action.payload.paymentIntentId;
            state.createPayment.clientSecret = action.payload.clientSecret;
        },
        createPaymentFail(state, action) {
            state.createPayment.loading = false;
            state.createPayment.error = action.payload;
            state.createPayment.success = false;
            state.createPayment.paymentIntentId = null;
            state.createPayment.clientSecret = null;
        },

        verifyPaymentStart(state) {
            state.verifyPayment.loading = true;
            state.verifyPayment.error = null;
            state.verifyPayment.success = false;
            state.verifyPayment.status = null;
            state.verifyPayment.amount = null;
            state.verifyPayment.currency = null;
            state.verifyPayment.metadata = null;
        },
        verifyPaymentSuccess(state, action) {
            state.verifyPayment.loading = false;
            state.verifyPayment.error = null;
            state.verifyPayment.success = true;
            state.verifyPayment.status = action.payload.status;
            state.verifyPayment.amount = action.payload.amount;
            state.verifyPayment.currency = action.payload.currency;
            state.verifyPayment.metadata = action.payload.metadata;
        },
        verifyPaymentFail(state, action) {
            state.verifyPayment.loading = false;
            state.verifyPayment.error = action.payload;
            state.verifyPayment.success = false;
            state.verifyPayment.status = null;
            state.verifyPayment.amount = null;
            state.verifyPayment.currency = null;
            state.verifyPayment.metadata = null;
        },

        refundPaymentStart(state) {
            state.refundPayment.loading = true;
            state.refundPayment.error = null;
            state.refundPayment.success = false;
            state.refundPayment.refundId = null;
            state.refundPayment.status = null;
            state.refundPayment.amount = null;
        },
        refundPaymentSuccess(state, action) {
            state.refundPayment.loading = false;
            state.refundPayment.error = null;
            state.refundPayment.success = true;
            state.refundPayment.refundId = action.payload.refundId;
            state.refundPayment.status = action.payload.status;
            state.refundPayment.amount = action.payload.amount;
        },
        refundPaymentFail(state, action) {
            state.refundPayment.loading = false;
            state.refundPayment.error = action.payload;
            state.refundPayment.success = false;
            state.refundPayment.refundId = null;
            state.refundPayment.status = null;
            state.refundPayment.amount = null;
        },

        resetCreatePaymentState(state) {
            state.createPayment = initialState.createPayment;
        },
        resetVerifyPaymentState(state) {
            state.verifyPayment = initialState.verifyPayment;
        },
        resetRefundPaymentState(state) {
            state.refundPayment = initialState.refundPayment;
        },
    },
});

export const {
    createPaymentStart,
    createPaymentSuccess,
    createPaymentFail,
    verifyPaymentStart,
    verifyPaymentSuccess,
    verifyPaymentFail,
    refundPaymentStart,
    refundPaymentSuccess,
    refundPaymentFail,
    resetCreatePaymentState,
    resetVerifyPaymentState,
    resetRefundPaymentState,
} = paymentSlice.actions;

export default paymentSlice.reducer;