import { useMemo } from "react";
import { useParams } from "react-router-dom";
import {useElectionDetails, useElectionResults, useElectionStatus } from "../../hooks/ElectionResultsHook";
import ElectionHeader from "../../components/ElectionResults/ElectionHeaderCard";
import ElectionNotFound from "../../components/ElectionResults/ElectionNotFoundCard";
import LoadingSpinner from "../../components/Commons/LoadingSpinner";
import ResultsContainer from "../../components/ElectionResults/ResultsCard";
import ErrorMessage from "../../components/Commons/Error";

const ElectionResultPage = () => {
    const { id } = useParams();

    const {
        election,
        loading: electionLoading,
        error: electionError
    } = useElectionDetails(id);

    const {
        result,
        loading: resultsLoading,
        error: resultsError
    } = useElectionResults(id);

    const { getStatus } = useElectionStatus();

    const loading = electionLoading || resultsLoading;
    const error = electionError || resultsError;
    const status = useMemo(() => getStatus(election), [election, getStatus]);

    if (loading) return <LoadingSpinner message="Loading election results..." />;
    if (!election) return <ElectionNotFound />;

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-600 via-indigo-800 to-blue-500">
            <ElectionHeader election={election} status={status} />

            {error && <ErrorMessage error={error} />}

            <ResultsContainer result={result} status={status} />
        </div>
    );
};

export default ElectionResultPage;