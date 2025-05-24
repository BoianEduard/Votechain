import * as contractSlice from "../slices/contractSlice";
import contractAPI from '../../api/contractAPI';
import {encryptVote,getConnectedAddress, preparePublicKey} from "../../utils/blockchain";
import {ethers} from 'ethers';
import {Buffer} from 'buffer';

export const deployContract = (electionId) => async (dispatch) => {
    dispatch(contractSlice.deployContractStart());
    try {
        const data = await contractAPI.deployContract({ electionId });
        dispatch(contractSlice.deployContractSuccess(data));
        return data;
    } catch (error) {
        const serializedError = {
            message: error.message || "Deploying contract failed",
            code: error.code,
            status: error.response?.status
        };
        dispatch(contractSlice.deployContractFail(serializedError));
        throw new Error(serializedError.message);
    }
};

export const castVote = (electionId, candidateId, electionPublicKey, registeredAddress) => async (dispatch) => {
    dispatch(contractSlice.castVoteStart());
    try {
        const address = await getConnectedAddress();

        if (address !== registeredAddress.toLowerCase()) {
            throw new Error("Connected MetaMask address does not match registered address");
        }

        // 1. Encrypt the vote (returns base64)
        const encryptedVoteBase64 = await encryptVote(candidateId.toString(), electionPublicKey);

        // 2. Convert base64 to bytes for blockchain storage
        const encryptedVoteBuffer = Buffer.from(encryptedVoteBase64, 'base64');
        const encryptedVoteHex = '0x' + encryptedVoteBuffer.toString('hex');

        // 3. Hash the encrypted data for signing
        const voteHash = ethers.keccak256(encryptedVoteHex);

        // 4. Sign the hash with MetaMask
        const signature = await window.ethereum.request({
            method: 'personal_sign',
            params: [voteHash, address],
        });

        // 5. Send to backend - pass the hex-encoded encrypted vote
        const data = await contractAPI.castVote({
            electionId,
            encryptedVote: encryptedVoteHex, // Send as hex string
            signature,
            address,
        });

        dispatch(contractSlice.castVoteSuccess(data));
        return data;

    } catch (error) {
        const serializedError = {
            message: error.message || "Casting vote failed",
            code: error.code,
            status: error.response?.status,
        };
        dispatch(contractSlice.castVoteFail(serializedError));
        throw new Error(serializedError.message);
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
        const errorMessage = error?.message || error || "Unknown error fetching results";
        dispatch(contractSlice.fetchResultsFail(errorMessage));
        throw error;
    }
};