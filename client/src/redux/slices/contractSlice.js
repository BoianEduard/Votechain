import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loading: false,
    error: null,
    contractAddress: null,
    isDeployed: false,
    voteSubmitted: false,
    results: {} // store results by electionId
};

const contractSlice = createSlice({
    name: 'contract',
    initialState,
    reducers: {
        deployContractStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        deployContractSuccess: (state, action) => {
            state.loading = false;
            state.contractAddress = action.payload.contractAddress;
            state.isDeployed = true;
        },
        deployContractFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        fetchContractStatusStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchContractStatusSuccess: (state, action) => {
            state.loading = false;
            state.contractAddress = action.payload.contractAddress;
            state.isDeployed = action.payload.isDeployed;
        },
        fetchContractStatusFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        castVoteStart: (state) => {
            state.loading = true;
            state.error = null;
            state.voteSubmitted = false;
        },
        castVoteSuccess: (state) => {
            state.loading = false;
            state.voteSubmitted = true;
        },
        castVoteFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        fetchResultsStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchResultsSuccess: (state, action) => {
            state.loading = false;
            const { electionId, result } = action.payload;
            state.results[electionId] = result;
        },
        fetchResultsFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        resetContractState: () => initialState
    }
});

export const {
    deployContractStart,
    deployContractSuccess,
    deployContractFail,
    fetchContractStatusStart,
    fetchContractStatusSuccess,
    fetchContractStatusFail,
    castVoteStart,
    castVoteSuccess,
    castVoteFail,
    fetchResultsStart,
    fetchResultsSuccess,
    fetchResultsFail,
    resetContractState
} = contractSlice.actions;

export default contractSlice.reducer;