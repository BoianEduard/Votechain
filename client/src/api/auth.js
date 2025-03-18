import axios from 'axios';
import { API_URL } from "../config/config"
const API_ENDPOINT = `${API_URL}/auth`;

const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_ENDPOINT}/login`, credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Login failed. Please try again.';
  }
};

const register = async (userData) => {
  try {
    const response = await axios.post(`${API_ENDPOINT}/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Registration failed. Please try again.';
  }
};

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
