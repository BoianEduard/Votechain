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

const API_ENDPOINT = `${API_URL}/election`;

const createElection = async (data) => {
    try {
        const response = await axiosInstance.post(`${API_ENDPOINT}/create-election`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Creating election failed";
    }
};

const addCandidates = async (candidates) => {
    try {
        const response = await axiosInstance.post(`${API_ENDPOINT}/set-candidates`, candidates);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Adding candidates failed";
    }
};

const addWhitelist = async (whitelistData) => {
    try {
        const response = await axiosInstance.post(`${API_ENDPOINT}/set-whitelist`, whitelistData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Adding whitelist failed";
    }
};

const addAll = async (electionId) => {
    try {
        const response = await axiosInstance.post(`${API_ENDPOINT}/set-whitelist-all`, { electionId });
        return response.data
    } catch (error) {
        throw error.response?.data?.message || "Adding all voters failed";
    }
}

const getAllElections = async () => {
    try {
        const response = await axiosInstance.get(`${API_ENDPOINT}/elections`);
        console.log(response);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Fetching elections failed";
    }
}

const getElection = async (electionId) => {
    try {
        const response = await axiosInstance.get(`${API_ENDPOINT}/elections/${electionId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Fetching election details failed";
    }
}

const deleteElection = async (electionId) => {
    try {
        await axiosInstance.delete(`${API_ENDPOINT}/${electionId}/delete-election`);
        console.log(`Election data was deleted sucessfully for election ${electionId}`);
    } catch (votersError) {
            console.warn(`Failed to delete voter registrations for election ${electionId}:`, votersError);
    }
};

export default {
    createElection,
    addCandidates,
    addWhitelist,
    addAll,
    getAllElections,
    getElection,
    deleteElection
};