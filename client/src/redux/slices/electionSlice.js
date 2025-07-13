import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    elections: [],
    selectedElection: null,
    loading: false,
    error: null,
    results: {}, // Adaugă această linie
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
        },
        fetchElectionsStart(state) {
            state.loading = true;
            state.error = null;
        },
        fetchElectionsSuccess(state, action) {
            state.loading = false;
            state.elections = action.payload;
            state.error = null;
        },
        fetchElectionsFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        fetchElectionDetailsStart(state) {
            state.loading = true;
            state.error = null;
        },
        fetchElectionDetailsSuccess(state, action) {
            state.loading = false;
            state.selectedElection = action.payload;
            state.error = null;
        },
        fetchElectionDetailsFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        deleteElectionStart(state) {
            state.loading = true;
            state.error = null;
        },
        deleteElectionSuccess(state, action) {
            state.loading = false;
            state.error = null;
        },
        deleteElectionFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        getDashboardStatsStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        getDashboardStatsSuccess: (state, action) => {
            state.loading = false;
            state.dashboardStats = action.payload;
        },
        getDashboardStatsFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        getVoterTurnoutStart(state) {
            state.loading = true;
            state.error = null;
        },
        getVoterTurnoutSuccess(state, action) {
            state.loading = false;
            state.voterTurnout = action.payload;
            state.error = null;
        },
        getVoterTurnoutFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        checkVoterCountStart(state) {
            state.voterCountLoading = true;
            state.voterCountError = null;
        },
        checkVoterCountSuccess(state, action) {
            state.voterCountLoading = false;
            state.voterCount = action.payload.voterCount;
            state.voterCountError = null;
        },
        checkVoterCountFail(state, action) {
            state.voterCountLoading = false;
            state.voterCountError = action.payload;
            state.voterCount = 0;
        },
        resetVoterCount(state) {
            state.voterCount = 0;
            state.voterCountLoading = false;
            state.voterCountError = null;
        },
        fetchResultsStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchResultsSuccess: (state, action) => {
            state.loading = false;
            const { electionId, result } = action.payload;
            // Verifică dacă results există și inițializează-l dacă nu
            if (!state.results) {
                state.results = {};
            }
            state.results[electionId] = result;
        },
        fetchResultsFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }
    }
});

export const {
    createElectionStart, createElectionSuccess, createElectionFail,
    addCandidatesStart, addCandidatesSuccess, addCandidatesFail,
    addWhitelistStart, addWhitelistSuccess, addWhitelistFail,
    fetchElectionsStart, fetchElectionsSuccess, fetchElectionsFail,
    fetchElectionDetailsStart, fetchElectionDetailsSuccess, fetchElectionDetailsFail,
    deleteElectionStart, deleteElectionSuccess, deleteElectionFail,
    getDashboardStatsStart, getDashboardStatsFail, getDashboardStatsSuccess,
    getVoterTurnoutStart, getVoterTurnoutSuccess, getVoterTurnoutFail,
    checkVoterCountStart, checkVoterCountSuccess, checkVoterCountFail, resetVoterCount,
    fetchResultsStart, fetchResultsSuccess, fetchResultsFail
} = electionSlice.actions;

export default electionSlice.reducer;