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

const addDomainWhitelist = async (domainData) => {
    try {
        const response = await axiosInstance.post(`${API_ENDPOINT}/set-domain-whitelist`, domainData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Adding domain whitelist failed";
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
    } catch (votersError) {
            console.warn(`Failed to delete voter registrations for election ${electionId}:`, votersError);
    }
};

const getDashboardStats = async () => {
    const response = await axiosInstance.get(`${API_ENDPOINT}/dashboard-stats`);
    return response.data;
};

const getVoterTurnout = async (electionId) => {
    try {
        const response = await axiosInstance.get(
            `${API_ENDPOINT}/${electionId}/turnout`
        );
        return response.data;
    } catch (error) {
        throw (
            error.response?.data?.message || "Fetching voter turnout failed"
        );
    }
};

const checkWhitelistCount = async (emails) => {
    try {
        const response = await axiosInstance.post(`${API_ENDPOINT}/check-whitelist-count`, { emails });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Checking whitelist count failed";
    }
};

const checkDomainWhitelistCount = async (domains) => {
    try {
        const response = await axiosInstance.post(`${API_ENDPOINT}/check-domain-count`, { domains });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Checking domain whitelist count failed";
    }
};

const checkAllUsersCount = async () => {
    try {
        const response = await axiosInstance.get(`${API_ENDPOINT}/check-all-count`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Checking all users count failed";
    }
};

const getElectionResults = async (electionId) => {
    try {
        const response = await axiosInstance.get(`${API_ENDPOINT}/${electionId}/results`);
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || "Getting election results failed";
        const customError = new Error(message);
        customError.status = error.response?.status;
        throw customError;
    }
};


export default {
    createElection,
    addCandidates,
    addWhitelist,
    addDomainWhitelist,
    addAll,
    getAllElections,
    getElection,
    deleteElection,
    getDashboardStats,
    getVoterTurnout,
    checkWhitelistCount,
    checkDomainWhitelistCount,
    checkAllUsersCount,
    getElectionResults
};