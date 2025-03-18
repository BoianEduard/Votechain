import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    elections: [],
    selectedElection: null,
    loading: false,
    error: null,
};

const electionSlice = createSlice({
    name: 'election',
    initialState,
    reducers: {

        createElectionStart(state) {
            state.loading = true;
            state.error = null;
        },
        createElectionSuccess(state, action) {
            state.loading = false;
            state.error = null;
        },
        createElectionFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        
        addCandidatesStart(state) {
            state.loading = true;
            state.error = null;
        },
        addCandidatesSuccess(state, action) {
            state.loading = false;
            state.error = null;
        },
        addCandidatesFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        
        addWhitelistStart(state) {
            state.loading = true;
            state.error = null;
        },
        addWhitelistSuccess(state, action) {
            state.loading = false;
            state.error = null;
        },
        addWhitelistFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        }
    }
});

export const {
    createElectionStart, createElectionSuccess, createElectionFail,
    addCandidatesStart, addCandidatesSuccess, addCandidatesFail,
    addWhitelistStart, addWhitelistSuccess, addWhitelistFail
} = electionSlice.actions;

export default electionSlice.reducer;