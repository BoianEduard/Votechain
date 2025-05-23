import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  token: null,
  isChecking: true,  // <-- initially true, because on app load we check auth
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.isChecking = true;
      state.error = null;
    },
    loginSuccess(state, action) {
      state.isChecking = false;
      state.isAuthenticated = true;
      state.token = action.payload;
    },
    loginFailure(state, action) {
      state.isChecking = false;
      state.isAuthenticated = false;
      state.token = null;
      state.error = action.payload || null;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.token = null;
      state.isChecking = false;
      state.error = null;
    }
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;

export default authSlice.reducer;