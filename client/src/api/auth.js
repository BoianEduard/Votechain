import axios from 'axios';
import { API_URL } from "../config/config"
const API_ENDPOINT = `${API_URL}/auth`;

/**
 * Logs in the user with the provided credentials.
 * @param {Object} credentials - The user's login credentials.
 * @returns {Promise} - The API response.
 */
const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_ENDPOINT}/login`, credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Login failed. Please try again.';
  }
};

/**
 * Registers a new user.
 * @param {Object} userData - The user's registration details.
 * @returns {Promise} - The API response.
 */
const register = async (userData) => {
  try {
    const response = await axios.post(`${API_ENDPOINT}/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Registration failed. Please try again.';
  }
};

/**
 * Logs out the user by removing their token.
 * @returns {Promise} - The API response.
 */
const logOut = async () => {
  try {
    await axios.post(`${API_ENDPOINT}/logout`);
    return true;
  } catch (error) {
    throw error.response?.data?.message || 'Logout failed. Please try again.';
  }
};

export default {
  login,
  register,
  logOut,
};
