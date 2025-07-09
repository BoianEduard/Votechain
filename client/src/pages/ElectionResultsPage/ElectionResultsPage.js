import { useMemo } from "react";
import { useParams } from "react-router-dom";
import {useElectionDetails, useElectionResults, useElectionStatus } from "../../hooks/ElectionResultsHook";
import ElectionHeader from "../../components/ElectionResults/ElectionHeaderCard";
import ElectionNotFound from "../../components/ElectionResults/ElectionNotFoundCard";
import LoadingSpinner from "../../components/Commons/LoadingSpinner";
import ResultsContainer from "../../components/ElectionResults/ResultsCard";
import TransactionHistoryCard from "../../components/ElectionResults/TransactionHistoryCard";

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

    const status = useMemo(() => {
        return election ? getStatus(election) : 'Loading...';
    }, [election, getStatus]);

    if (loading) return <LoadingSpinner message="Loading election results..." />;
    if (!election) return <ElectionNotFound />;

    return (
        <div className="min-h-screen bg-gradient-to-b from-red-500 via-purple-800 to-indigo-400">
            <ElectionHeader election={election} status={status} />
            <ResultsContainer result={result} status={status} />
            <TransactionHistoryCard contractAddress={election?.contractAddress} />
        </div>
    );
};

export default ElectionResultPage;