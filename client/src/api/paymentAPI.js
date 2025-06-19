import axios from "axios";
import { API_URL } from "../config/config";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

const API_ENDPOINT = `${API_URL}/payment`;

axiosInstance.interceptors.request.use(
    (config) => {
        const token = Cookies.get("token") || sessionStorage.getItem("authToken");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

const createPaymentIntent = async (data) => {
    try {
        const response = await axiosInstance.post(`${API_ENDPOINT}/create-payment-intent`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || "Failed to create payment intent";
    }
};

const verifyPayment = async (paymentIntentId) => {
    try {
        const response = await axiosInstance.get(`${API_ENDPOINT}/verify-payment/${paymentIntentId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || "Failed to verify payment";
    }
};

const refundPayment = async (refundData) => {
    try {
        const response = await axiosInstance.post(`${API_ENDPOINT}/refund`, refundData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || "Failed to process refund";
    }
};

export default {
    createPaymentIntent,
    verifyPayment,
    refundPayment,
};