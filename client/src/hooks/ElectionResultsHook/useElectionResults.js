import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchElectionResults } from "../../redux/thunks/electionThunks";

export const useElectionResults = (id) => {
    const dispatch = useDispatch();
    const result = useSelector((state) => state.election.results?.[id] ?? null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadResults = async () => {
            setLoading(true);
            setError(null);
            try {
                await dispatch(fetchElectionResults(id));
            } catch (err) {
                const errorMessage = err?.message || err || "Failed to load results. Please try again later.";
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadResults();
        }
    }, [dispatch, id]);

    return {
        result,
        loading,
        error
    };
};