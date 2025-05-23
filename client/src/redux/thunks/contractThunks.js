import * as contractSlice from "../slices/contractSlice";
import contractAPI from '../../api/contractAPI';
import {encryptVote,getConnectedAddress, preparePublicKey} from "../../utils/blockchain";
import {ethers} from 'ethers';

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

        // 1. Encrypt the vote
        const encryptedVote = await encryptVote(candidateId.toString(), electionPublicKey);

        // 2. Convert to bytes and hash
        const encryptedVoteBytes = ethers.toUtf8Bytes(encryptedVote);
        const voteHash = ethers.keccak256(encryptedVoteBytes);

        // 3. Sign the hash with MetaMask
        const signature = await window.ethereum.request({
            method: 'personal_sign',
            params: [voteHash, address],
        });

        // 4. Send to backend - pass the hex-encoded values
        const data = await contractAPI.castVote({
            electionId,
            encryptedVote: ethers.hexlify(encryptedVoteBytes), // Send hex-encoded bytes
            signature,  // This is already a hex string from personal_sign
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