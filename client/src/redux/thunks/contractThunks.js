import * as contractSlice from "../slices/contractSlice";
import contractAPI from '../../api/contractAPI';
import {encryptVote,getConnectedAddress} from "../../utils/blockchain";
import {ethers} from 'ethers';
import serializeError from '../../utils/serializeError';
import {signWithMetaMask} from "../../utils/metamask";

export const deployContract = (electionId) => async (dispatch) => {
    dispatch(contractSlice.deployContractStart());
    try {
        const data = await contractAPI.deployContract({ electionId });
        dispatch(contractSlice.deployContractSuccess(data));
        return data;
    } catch (error) {
        const serializedError = serializeError(error, "Deploying contract failed");
        dispatch(contractSlice.deployContractFail(serializedError));
        throw error;
    }
};

export const castVote = (electionId, candidateId, electionPublicKey, registeredAddress) => async (dispatch) => {
    dispatch(contractSlice.castVoteStart());
    try {
        const address = await getConnectedAddress();

        if (address !== registeredAddress.toLowerCase()) {
            throw new Error("Connected MetaMask address does not match registered address");
        }

        //return array buffer containing encrypted data & convert to hex
        const encryptedData = await encryptVote(candidateId.toString(), electionPublicKey);
        const encryptedVoteHex = '0x' + Buffer.from(encryptedData).toString('hex');

        // hash the vote before signing
        const voteHash = ethers.keccak256(encryptedVoteHex);
        const signature = await signWithMetaMask(address, voteHash);

        // send to backend - pass the hex-encoded encrypted vote
        const data = await contractAPI.castVote({
            electionId,
            encryptedVote: encryptedVoteHex, // send the hex string
            signature,
            address,
        });

        dispatch(contractSlice.castVoteSuccess(data));
        return data;

    } catch (error) {
        const serializedError = serializeError(error, "Casting vote failed");
        dispatch(contractSlice.castVoteFail(serializedError));
        throw error;
    }
};

export const fetchElectionResults = (electionId) => async (dispatch) => {
    dispatch(contractSlice.fetchResultsStart());
    try {
        const result = await contractAPI.getElectionResults(electionId);
        dispatch(contractSlice.fetchResultsSuccess({ electionId, result }));
        console.log(result);
        return result;
    } catch (error) {
        const serializedError = serializeError(error, "Fetching election results failed");
        dispatch(contractSlice.castVoteFail(serializedError));
        throw error;
    }
};