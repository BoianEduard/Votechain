import { loginStart, loginSuccess, loginFailure, logout } from "../slices/authSlice";
import authAPI from "../../api/auth";
import { setUserSuccess } from "../slices/userSlice";


const loginUser = (credentials) => async (dispatch) => {
  dispatch(loginStart());

  try {
    const data = await authAPI.login(credentials);
    dispatch(loginSuccess(data.token));
    dispatch(setUserSuccess(data.user));
  } catch (error) {
    dispatch(loginFailure(error));
  }
};


const registerUser = (userData) => async (dispatch) => {
  dispatch(loginStart()); 

  try {
    const data = await authAPI.register(userData); 
    dispatch(loginSuccess(data.token));
    localStorage.setItem('privateKey', data.privateKey);
  } catch (error) {
    dispatch(loginFailure(error));
  }
};


const logoutUser = () => (dispatch) => {
  dispatch(logout());
  sessionStorage.removeItem('privateKey');
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
