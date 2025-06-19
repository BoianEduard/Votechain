import axios from "axios";
import { API_URL } from "../config/config";
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true
});

axiosInstance.interceptors.request.use(
    config => {
        const token = Cookies.get("token") || sessionStorage.getItem('authToken');

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    error => Promise.reject(error)
);

const API_ENDPOINT = `${API_URL}/user`;


const fetchUser = async () => {
    try {
        const response = await axiosInstance.get(`${API_ENDPOINT}/me`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Fetching user data failed";
    }
};

const checkEligibility = async (electionId) => {
    try {
        const response = await axiosInstance.get(`${API_ENDPOINT}/check-eligibility/${electionId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to check eligibility";
    }
};

export default {
    fetchUser,
    checkEligibility
};
