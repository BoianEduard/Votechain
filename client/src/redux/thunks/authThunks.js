import { loginStart, loginSuccess, loginFailure, logout } from "../slices/authSlice";
import authAPI from "../../api/auth";
import { setUserSuccess } from "../slices/userSlice";


const loginUser = (credentials) => async (dispatch) => {
  dispatch(loginStart());

  try {
    const data = await authAPI.login(credentials);
    localStorage.setItem('token', data.token);
    dispatch(loginSuccess(data.token)); 
    dispatch(setUserSuccess(data.user));
    console.log(data.user)
  } catch (error) {
    dispatch(loginFailure(error));
  }
};


const registerUser = (userData) => async (dispatch) => {
  dispatch(loginStart()); 

  try {
    const data = await authAPI.register(userData); 
    localStorage.setItem('token', data.token); 
    localStorage.setItem('privateKey',data.privateKey)
    dispatch(loginSuccess(data.token));
  } catch (error) {
    dispatch(loginFailure(error));
  }
};


const logoutUser = () => (dispatch) => {
  localStorage.removeItem('token');
  dispatch(logout());
};


const checkAuthStatus = () => (dispatch) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    dispatch(loginSuccess(token)); 
  }
};

export default {
  loginUser,
  registerUser,
  logoutUser,
  checkAuthStatus,
};
