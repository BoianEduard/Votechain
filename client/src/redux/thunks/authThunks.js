import { loginStart, loginSuccess, loginFailure, logout } from "../slices/authSlice";
import authAPI from "../../api/auth";


const loginUser = (credentials) => async (dispatch) => {
  dispatch(loginStart()); // Start login process

  try {
    const data = await authAPI.login(credentials); // Call the login API
    localStorage.setItem('token', data.token); // Save token to localStorage
    dispatch(loginSuccess(data.token)); // Dispatch success action
  } catch (error) {
    dispatch(loginFailure(error)); // Dispatch failure action with error message
  }
};


const registerUser = (userData) => async (dispatch) => {
  dispatch(loginStart()); // Start registration process

  try {
    const data = await authAPI.register(userData); 
    localStorage.setItem('token', data.token); // Save token to localStorage
    localStorage.setItem('privateKey',data.privateKey)
    dispatch(loginSuccess(data.token)); // Dispatch success action
  } catch (error) {
    dispatch(loginFailure(error)); // Dispatch failure action with error message
  }
};


const logoutUser = () => (dispatch) => {
  localStorage.removeItem('token'); // Clear token from localStorage
  dispatch(logout()); // Dispatch logout action to update Redux state
};


const checkAuthStatus = () => (dispatch) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    dispatch(loginSuccess(token)); // If token exists, dispatch success
  }
};

export default {
  loginUser,
  registerUser,
  logoutUser,
  checkAuthStatus,
};
