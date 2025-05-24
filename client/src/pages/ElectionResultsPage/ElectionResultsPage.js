import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchElectionDetails } from "../../redux/thunks/electionThunks";
import { fetchElectionResults } from "../../redux/thunks/contractThunks";
import ElectionHeader from "../../components/ElectionResults/ElectionHeaderCard";
import ElectionNotFound from "../../components/ElectionResults/ElectionNotFoundCard";
import LoadingSpinner from "../../components/Commons/LoadingSpinner";
import ResultsContainer from "../../components/ElectionResults/ResultsCard";
import ErrorMessage from "../../components/Commons/Error";

const ElectionResultPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const election = useSelector((state) =>
        state.election.elections.find((e) => e.id === id)
    );
    const result = useSelector((state) => state.contract.results?.[id] ?? null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadElection = async () => {
            setLoading(true);
            try {
                await dispatch(fetchElectionDetails(id));
                await dispatch(fetchElectionResults(id));
            } catch (err) {
                const errorMessage = err?.message || err || "Failed to load results. Please try again later.";
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        loadElection();
    }, [dispatch, id]);

    const getStatus = () => {
        if (!election) return "Unknown";

        const now = new Date();
        if (new Date(election.startDate) > now) return "Not Started";
        if (new Date(election.endDate) < now) return "Closed";
        return "Vote In Progress";
    };

    if (loading) return <LoadingSpinner message="Loading election results..." />;
    if (!election) return <ElectionNotFound />;

    const status = getStatus();

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-700 to-indigo-500">
            <ElectionHeader election={election} status={status} />

            {error && <ErrorMessage error={error} />}

            <ResultsContainer result={result} status={status} />
        </div>
    );
};

export default ElectionResultPage;