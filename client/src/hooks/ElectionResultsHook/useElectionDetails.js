import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchElectionDetails } from "../../redux/thunks/electionThunks";

export const useElectionDetails = (id) => {
    const dispatch = useDispatch();
    const election = useSelector((state) => state.election.selectedElection);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadElection = async () => {
            setLoading(true);
            setError(null);
            try {
                await dispatch(fetchElectionDetails(id));
            } catch (err) {
                const errorMessage = err?.message || err || "Failed to load election details. Please try again later.";
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadElection();
        }
    }, [dispatch, id]);

    return {
        election,
        loading,
        error
    };
};