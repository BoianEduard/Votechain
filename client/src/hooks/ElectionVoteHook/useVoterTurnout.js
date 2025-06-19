import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getVoterTurnout } from "../../redux/thunks/electionThunks";

export const useVoterTurnout = (electionId) => {
    const dispatch = useDispatch();
    const voterTurnout = useSelector(s => s.election.voterTurnout);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTurnout = async () => {
            if (!electionId) return;

            try {
                setLoading(true);
                setError(null);
                await dispatch(getVoterTurnout(electionId));
            } catch (err) {
                console.error("Failed to load voter turnout:", err);
                const errorMessage = err?.message || "Failed to load voter turnout.";
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchTurnout();
    }, [electionId, dispatch]);

    return {
        voterTurnout,
        loading,
        error
    };
};