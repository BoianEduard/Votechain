import * as electionSlice from "../slices/electionSlice";
import electionAPI from '../../api/election';

export const createElection = (details) => async (dispatch) => {
    dispatch(electionSlice.createElectionStart());
    try {
        const data = await electionAPI.createElection(details);
        dispatch(electionSlice.createElectionSuccess(data));
        return data; 
    } catch (error) {
        const serializedError = {
            message: error.message || "Creating election failed",
            // Only include safe, serializable properties
            code: error.code,
            status: error.response?.status
        };
        dispatch(electionSlice.createElectionFail(serializedError));
        throw error; // Re-throw so we can catch it in the component
    }
};

export const addCandidates = (candidateData) => async (dispatch) => {
    dispatch(electionSlice.addCandidatesStart());
    try {
        const data = await electionAPI.addCandidates(candidateData);
        dispatch(electionSlice.addCandidatesSuccess(data));
        return data;
    } catch (error) {
        // Handle error properly for Redux
        const serializedError = {
            message: error.message || "Adding candidates failed",
            // Only include safe, serializable properties
            code: error.code,
            status: error.response?.status
        };
        dispatch(electionSlice.addCandidatesFail(serializedError));
        throw error;
    }
};

export const addWhitelist = (whitelistData) => async (dispatch) => {
    dispatch(electionSlice.addWhitelistStart());
    try {
        const data = await electionAPI.addWhitelist(whitelistData);
        dispatch(electionSlice.addWhitelistSuccess(data));
        return data;
    } catch (error) {
        // Handle error properly for Redux
        const serializedError = {
            message: error.message || "Adding whitelist failed",
            // Only include safe, serializable properties
            code: error.code,
            status: error.response?.status
        };
        dispatch(electionSlice.addWhitelistFail(serializedError));
        throw error;
    }

};

export const addAll = (electionId) => async (dispatch) => {
    dispatch(electionSlice.addWhitelistStart()); 
    try {
        const data = await electionAPI.addAll(electionId);
        dispatch(electionSlice.addWhitelistSuccess(data));
        return data;
    } catch (error){
        const serializedError = {
            message: error.message || "Adding whitelist failed",
            code: error.code,
            status: error.response?.status
        };
        dispatch(electionSlice.addWhitelistFail(serializedError));
        throw error;
    }
}