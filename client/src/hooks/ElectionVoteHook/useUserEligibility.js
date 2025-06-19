import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as userThunks from "../../redux/thunks/userThunks";

export const useUserEligibility = (electionId) => {
    const dispatch = useDispatch();
    const user = useSelector(s => s.user.userData);
    const [eligibility, setEligibility] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkEligibility = async () => {
            if (!electionId || !user?.id) {
                setEligibility(null);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const response = await dispatch(userThunks.checkEligibility(electionId));
                setEligibility(response);
            } catch (err) {
                console.error("Failed to check eligibility:", err);
                const errorMessage = err?.message || "Failed to check eligibility.";
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        checkEligibility();
    }, [electionId, user?.id, dispatch]);

    return {
        eligibility,
        loading,
        error
    };
};