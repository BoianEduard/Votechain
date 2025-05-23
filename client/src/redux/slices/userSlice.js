import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userData: null,
    loadingUser: false,
    errorUser: null,
    eligibility: null,
    loadingEligibility: false,
    errorEligibility: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserStart(state) {
            state.loadingUser = true;
            state.errorUser = null;
        },
        setUserSuccess(state, action) {
            state.loadingUser = false;
            state.userData = action.payload;
        },
        setUserFailure(state, action) {
            state.loadingUser = false;
            state.errorUser = action.payload;
        },

        setEligibilityStart(state) {
            state.loadingEligibility = true;
            state.errorEligibility = null;
        },
        setEligibilitySuccess(state, action) {
            state.loadingEligibility = false;
            state.eligibility = action.payload;
        },
        setEligibilityFailure(state, action) {
            state.loadingEligibility = false;
            state.errorEligibility = action.payload;
        },

        clearUser(state) {
            state.userData = null;
            state.eligibility = null;
            state.errorUser = null;
            state.errorEligibility = null;
            state.loadingUser = false;
            state.loadingEligibility = false;
        },

        setUserUpdate(state, action) {
            if (state.userData) {
                state.userData = { ...state.userData, ...action.payload };
            }
        }
    }
});

export const {
    setUserStart,
    setUserSuccess,
    setUserFailure,
    setUserUpdate,
    clearUser,
    setEligibilityStart,
    setEligibilitySuccess,
    setEligibilityFailure
} = userSlice.actions;

export default userSlice.reducer;