import { setUserStart, setUserSuccess, setUserFailure, setEligibilityStart, setEligibilitySuccess, setEligibilityFailure} from '../slices/userSlice';
import userAPI from '../../api/userAPI';
import serializeError from '../../utils/serializeError';

export const fetchUser = () => async (dispatch) => {
    dispatch(setUserStart());
    try {
        const userData = await userAPI.fetchUser();
        dispatch(setUserSuccess(userData));
        return userData;
    } catch (error) {
        const serializedError = serializeError(error, "Fetching user data failed");
        dispatch(setUserFailure(serializedError));
        throw error;
    }
};

export const checkEligibility = (electionId) => async (dispatch) => {
    dispatch(setEligibilityStart());
    try {
        const data = await userAPI.checkEligibility(electionId);
        dispatch(setEligibilitySuccess(data));
        return data;
    } catch (error) {
        const serializedError = serializeError(error, "Checking eligibility failed");
        dispatch(setEligibilityFailure(serializedError));
        throw error;
    }
};