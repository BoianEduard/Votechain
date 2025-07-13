import { useState } from "react";
import { useDispatch } from "react-redux";
import * as contractThunks from "../../redux/thunks/contractThunks";

export const useVoteSubmit = () => {
    const dispatch = useDispatch();
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submitVote = async (electionId, candidateId, publicKey, userAddress) => {
        try {
            setError(null);
            setIsSubmitting(true);

            await dispatch(
                contractThunks.castVote(
                    electionId,
                    candidateId,
                    publicKey,
                    userAddress
                )
            );

            return { success: true };
        } catch (err) {
            console.error("Failed to submit vote:", err);
            const errorMessage = err || "Failed to submit vote. Please try again.";
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setIsSubmitting(false);
        }
    };

    const clearError = () => setError(null);

    return {
        error,
        isSubmitting,
        submitVote,
        clearError
    };
};