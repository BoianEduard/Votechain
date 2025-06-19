import axios from 'axios';
import { API_URL } from "../config/config";

const API_ENDPOINT = `${API_URL}/auth`;

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

const login = async (credentials) => {
  try {
    const response = await axiosInstance.post(`${API_ENDPOINT}/login`, credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Login failed. Please try again.';
  }
};

const register = async (userData) => {
  try {
    const response = await axiosInstance.post(`${API_ENDPOINT}/register`, userData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw error.response.data;
    } else {
      throw new Error('Registration failed. Please try again.');
    }
  }
};

const logout = async () => {
  try {
    const response = await axiosInstance.post(`${API_ENDPOINT}/logout`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const checkEmail = async (email) => {
  try {
    await axiosInstance.post(`${API_ENDPOINT}/check-email`, email);
    return true;
  } catch (error) {
    const message = error.response?.data?.message || 'Email check failed. Please try again.';
    throw new Error(message);
  }
};

const verifyAuth = async () => {
  try {
    const response = await axiosInstance.get(`${API_ENDPOINT}/verify`);
    return response.data;
  } catch (error) {
    return { authenticated: false };
  }
};

export default {
  login,
  register,
  logout,
  checkEmail,
  verifyAuth
};