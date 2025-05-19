import * as contractSlice from "../slices/contractSlice";
import contractAPI from '../../api/contract';

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
        throw error;
    }
};