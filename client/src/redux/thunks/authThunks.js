import { loginStart, loginSuccess, loginFailure, logout } from "../slices/authSlice";
import authAPI from "../../api/authAPI";
import { setUserSuccess } from "../slices/userSlice";
import { connectToMetaMask, signWithMetaMask } from "../../utils/metamask";
import serializeError from '../../utils/serializeError';

const loginUser = (credentials) => async (dispatch) => {
  dispatch(loginStart());

  try {
    const data = await authAPI.login(credentials);
    dispatch(loginSuccess(data.token));
    dispatch(setUserSuccess(data.user));
    return data;
  } catch (error) {
    const serializedError = serializeError(error, "Login failed");
    dispatch(loginFailure(serializedError));
    throw error;
  }
};

const registerUser = (userData) => async (dispatch) => {
  dispatch(loginStart());

  try {
    await authAPI.checkEmail({ email: userData.email });

    if (!window.ethereum) {
      throw new Error("MetaMask is not installed. You need a wallet to enter this site.");
    }

    const address = await connectToMetaMask();
    const message = `Register with Arbi1Vote: ${userData.email} at ${new Date().toISOString()}`;
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
    const serializedError = serializeError(error, "Registration failed");
    dispatch(loginFailure(serializedError));
    throw error;
  }
};

const logoutUser = () => async (dispatch) => {
  try {
    await authAPI.logout();
    dispatch(logout());
  } catch (error) {
    const serializedError = serializeError(error, "Logout failed");
    dispatch(loginFailure(serializedError));
    // aici nu mai aruncam eroarea, logoutul ar trebui sa se execute oricum
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
    const serializedError = serializeError(error, "Auth verification failed");
    dispatch(loginFailure(serializedError));
    throw error;
  }
};

export default {
  loginUser,
  registerUser,
  logoutUser,
  checkAuthStatus,
};