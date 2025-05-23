import { loginStart, loginSuccess, loginFailure, logout } from "../slices/authSlice";
import authAPI from "../../api/authAPI";
import { setUserSuccess } from "../slices/userSlice";
import {connectToMetaMask, signWithMetaMask} from "../../utils/metamask";

const loginUser = (credentials) => async (dispatch) => {
  dispatch(loginStart());

  try {
    const data = await authAPI.login(credentials);
    dispatch(loginSuccess(data.token));
    dispatch(setUserSuccess(data.user));
  } catch (error) {
    dispatch(loginFailure(error));
    throw new Error(error.message);
  }
};

const registerUser = (userData) => async (dispatch) => {
  dispatch(loginStart());

  try {
    await authAPI.checkEmail({ email: userData.email });

    if (!window.ethereum) {
      throw new Error("MetaMask is not installed. Please install MetaMask to continue.");
    }

    const address = await connectToMetaMask();
    const message = `Register with Votechain: ${userData.email} at ${new Date().toISOString()}`;
    const signature = await signWithMetaMask(address, message);

    const publicKey = await window.ethereum.request({
      method: 'eth_getEncryptionPublicKey',
      params: [address],
    }).catch(() => null);

    const enhancedUserData = {
      ...userData,
      address,
      signature,
      message,
      publicKey,
    };

    const data = await authAPI.register(enhancedUserData);

    dispatch(loginSuccess(data.token));
    dispatch(setUserSuccess(data.user));
    return data;

  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Registration failed";
    dispatch(loginFailure(errorMessage));
    throw new Error(errorMessage);
  }
};

const logoutUser = () => async (dispatch) => {
  try {
    await authAPI.logout();
    dispatch(logout());
  } catch (error) {
    dispatch(logout());
  }
};

const checkAuthStatus = () => async (dispatch) => {
  dispatch(loginStart());

  try {
    const data = await authAPI.verifyAuth();

    if (data.authenticated) {
      dispatch(loginSuccess(data.token));
      dispatch(setUserSuccess(data.user));
    } else {
      dispatch(loginFailure());
    }

    return data.authenticated;
  } catch (error) {
    dispatch(loginFailure(error));
    throw new Error(errorMessage);
  }
};

export default {
  loginUser,
  registerUser,
  logoutUser,
  checkAuthStatus,
};
