import axios from "axios";
import { API_URL } from "../config/config";

const API_ENDPOINT = `${API_URL}/election`;

const createElection = async (data) => {
    try {
        const response = await axios.post(`${API_ENDPOINT}/create-election`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Creating election failed";
    }
};

const addCandidates = async (candidates) => {
    try {
        const response = await axios.post(`${API_ENDPOINT}/set-candidates`, candidates);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Adding candidates failed";
    }
};

const addWhitelist = async (whitelistData) => {
    try {
        const response = await axios.post(`${API_ENDPOINT}/set-whitelist`, whitelistData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Adding whitelist failed";
    }
};

const addAll = async (electionId) => {
    try {
        const response = await axios.post(`${API_ENDPOINT}/set-whitelist-all`, { electionId });
        return response.data
    } catch (error) {
        throw error.response?.data?.message || "Adding all voters failed";
    }
}

export default {
    createElection,
    addCandidates,
    addWhitelist,
    addAll,
};