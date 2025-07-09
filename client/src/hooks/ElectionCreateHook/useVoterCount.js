import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import * as electionThunks from '../../redux/thunks/electionThunks';
import * as validator from '../../utils/validators';

export const useVoterCount = () => {
    const dispatch = useDispatch();
    const {
        voterCount,
        voterCountLoading,
        voterCountError
    } = useSelector(state => state.election);

    const calculateVoterCount = useCallback(async (formData) => {
        try {
            let result = { voterCount: 0 };

            if (formData.eligibilityType === "whitelist") {
                const emails = validator.parseWhitelist(formData.whitelist);
                if (emails.length > 0) {
                    result = await dispatch(electionThunks.checkWhitelistCount(emails));
                }
            } else if (formData.eligibilityType === "domain") {
                const domains = validator.parseDomainWhitelist(formData.domainWhitelist);
                if (domains.length > 0) {
                    result = await dispatch(electionThunks.checkDomainWhitelistCount(domains));
                }
            } else {
                result = await dispatch(electionThunks.checkAllUsersCount());
            }

            return result.voterCount || 0;
        } catch (error) {
            console.error("Error calculating voter count:", error);
            return 0;
        }
    }, [dispatch]);

    const resetVoterCount = useCallback(() => {
        dispatch(electionThunks.resetVoterCount());
    }, [dispatch]);

    return {
        voterCount,
        voterCountLoading,
        voterCountError,
        calculateVoterCount,
        resetVoterCount
    };
};