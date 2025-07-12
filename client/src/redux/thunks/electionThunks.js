import * as electionSlice from "../slices/electionSlice";
import electionAPI from '../../api/electionAPI';
import serializeError from '../../utils/serializeError';

export const createElection = (details) => async (dispatch) => {
    dispatch(electionSlice.createElectionStart());
    try {
        const data = await electionAPI.createElection(details);
        dispatch(electionSlice.createElectionSuccess(data));
        return data; 
    } catch (error) {
        const serializedError = serializeError(error, "Creating election failed");
        dispatch(electionSlice.createElectionFail(serializedError));
        throw error;
    }
};

export const addCandidates = (candidateData) => async (dispatch) => {
    dispatch(electionSlice.addCandidatesStart());
    try {
        const data = await electionAPI.addCandidates(candidateData);
        dispatch(electionSlice.addCandidatesSuccess(data));
        return data;
    } catch (error) {
        const serializedError = serializeError(error, "Adding candidates failed");
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
        const serializedError = serializeError(error, "Populating whitelist failed");
        dispatch(electionSlice.addWhitelistFail(serializedError));
        throw error;
    }

};

export const addDomainWhitelist = (electionId, domains) => async (dispatch) => {
    dispatch(electionSlice.addWhitelistStart());
    try {
        const data = await electionAPI.addDomainWhitelist({ electionId, domains });
        dispatch(electionSlice.addWhitelistSuccess(data));
        return data;
    } catch (error) {
        const serializedError = serializeError(error, "Populating whitelist domain failed");
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
        const serializedError = serializeError(error, "Populating whitelist failed");
        dispatch(electionSlice.addWhitelistFail(serializedError));
        throw error;
    }
}

export const fetchAllElections = () => async (dispatch) => {
    dispatch(electionSlice.fetchElectionsStart());
    try {
        const data = await electionAPI.getAllElections();
        dispatch(electionSlice.fetchElectionsSuccess(data));
        return data;
    } catch (error) {
        const serializedError = serializeError(error, "Fetching elections failed");
        dispatch(electionSlice.fetchElectionsFail(serializedError));
        throw error;
    }
}

export const fetchElectionDetails = (electionId) => async (dispatch) => {
    dispatch(electionSlice.fetchElectionDetailsStart());
    try {
        const data = await electionAPI.getElection(electionId);
        dispatch(electionSlice.fetchElectionDetailsSuccess(data));
        return data;
    } catch (error) {
        const serializedError = serializeError(error, "Fetching election details failed");
        dispatch(electionSlice.fetchElectionDetailsFail(serializedError));
        throw error;
    }
}

export const deleteElection = (electionId) => async (dispatch) => {
    dispatch(electionSlice.deleteElectionStart());
    try {
        const data = await electionAPI.deleteElection(electionId);
        dispatch(electionSlice.deleteElectionSuccess(data));
        return data;
    } catch (error) {
        const serializedError = serializeError(error, "Deleting election failed");
        dispatch(electionSlice.deleteElectionFail(serializedError));
        throw error;
    }
}

export const getDashboardStats = () => async (dispatch) => {
    dispatch(electionSlice.getDashboardStatsStart());
    try {
        const data = await electionAPI.getDashboardStats();
        dispatch(electionSlice.getDashboardStatsSuccess(data));
        return data;
    } catch (error) {
        const serializedError = serializeError(error, "Fetching dashboard stats failed");
        dispatch(electionSlice.getDashboardStatsFail(serializedError));
        throw error;
    }
};

export const getVoterTurnout = (electionId) => async (dispatch) => {
    dispatch(electionSlice.getVoterTurnoutStart());
    try {
        const data = await electionAPI.getVoterTurnout(electionId);
        dispatch(electionSlice.getVoterTurnoutSuccess(data));
        return data;
    } catch (error) {
        const serializedError = serializeError(error, "Fetching voter turnout failed");
        dispatch(electionSlice.getVoterTurnoutFail(serializedError));
        throw error;
    }
};

export const checkWhitelistCount = (emails) => async (dispatch) => {
    dispatch(electionSlice.checkVoterCountStart());
    try {
        const data = await electionAPI.checkWhitelistCount(emails);
        dispatch(electionSlice.checkVoterCountSuccess(data));
        return data;
    } catch (error) {
        const serializedError = serializeError(error, "Checking whitelist count failed");
        dispatch(electionSlice.checkVoterCountFail(serializedError));
        throw error;
    }
};

export const checkDomainWhitelistCount = (domains) => async (dispatch) => {
    dispatch(electionSlice.checkVoterCountStart());
    try {
        const data = await electionAPI.checkDomainWhitelistCount(domains);
        dispatch(electionSlice.checkVoterCountSuccess(data));
        return data;
    } catch (error) {
        const serializedError = serializeError(error, "Checking domain whitelist count failed");
        dispatch(electionSlice.checkVoterCountFail(serializedError));
        throw error;
    }
};

export const checkAllUsersCount = () => async (dispatch) => {
    dispatch(electionSlice.checkVoterCountStart());
    try {
        const data = await electionAPI.checkAllUsersCount();
        dispatch(electionSlice.checkVoterCountSuccess(data));
        return data;
    } catch (error) {
        const serializedError = serializeError(error, "Checking all users count failed");
        dispatch(electionSlice.checkVoterCountFail(serializedError));
        throw error;
    }
};

export const resetVoterCount = () => (dispatch) => {
    dispatch(electionSlice.resetVoterCount());
};

export const fetchElectionResults = (electionId) => async (dispatch) => {
    dispatch(electionSlice.fetchResultsStart());
    try {
        const result = await electionAPI.getElectionResults(electionId);
        dispatch(electionSlice.fetchResultsSuccess({ electionId, result }));
        console.log(result);
        return result;
    } catch (error) {
        const serializedError = serializeError(error, "Fetching election results failed");
        dispatch(electionSlice.fetchResultsFail(serializedError));
        throw error;
    }
};