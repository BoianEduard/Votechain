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

const API_ENDPOINT = `${API_URL}/contract`;

const deployContract = async (data) => {
    try {
        const response = await axiosInstance.post(`${API_ENDPOINT}/deploy`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Creating election failed";
    }
};

const castVote = async (data) => {
    try {
        const response = await axiosInstance.post(`${API_ENDPOINT}/cast-vote`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Casting vote failed";
    }
};

export default {
    deployContract,
    castVote,
};