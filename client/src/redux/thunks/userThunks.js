import { setUserStart, setUserSuccess, setUserFailure, setEligibilityStart, setEligibilitySuccess, setEligibilityFailure} from '../slices/userSlice';
import userAPI from '../../api/userAPI';

export const fetchUser = () => async (dispatch) => {
    dispatch(setUserStart());
    try {
        const userData = await userAPI.fetchUser();
        dispatch(setUserSuccess(userData));
    } catch (error) {
        dispatch(setUserFailure(error.message || 'Failed to fetch user'));
    }
};

export const checkEligibility = (electionId) => async (dispatch) => {
    dispatch(setEligibilityStart());
    try {
        const data = await userAPI.checkEligibility(electionId);
        dispatch(setEligibilitySuccess(data));
        return data;  // opțional, dacă vrei să folosești rezultatul imediat
    } catch (error) {
        dispatch(setEligibilityFailure(error.message || 'Failed to check eligibility'));
        throw error; // dacă vrei să lași să treacă mai departe eroarea
    }
};
