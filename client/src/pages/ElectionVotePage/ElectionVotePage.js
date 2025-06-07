import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { AlertCircle } from "lucide-react";

import ElectionBanner from "../../components/Vote/ElectionBanner";
import CandidateSelectionCard from "../../components/Vote/CandidateSelectionCard";
import VoteConfirmationCard from "../../components/Vote/VoteConfirmationCard";
import VoteSuccessCard from "../../components/Vote/VoteSuccessCard";
import TurnoutCard from "../../components/Vote/TurnoutCard";
import FooterCard from "../../components/Commons/FooterCard";
import {
    useElectionDetails,
    useSelectCandidate,
    useUserEligibility,
    useVoterTurnout,
    useVoteSubmit,
    useElectionUtils } from "../../hooks/ElectionVoteHook";

const ElectionVotePage = () => {
    const { electionId } = useParams();
    const user = useSelector(s => s.user.userData);

    const {
        election,
        loading: electionLoading,
        error: electionError
    } = useElectionDetails(electionId);

    const {
        selectedCandidate,
        votingStep,
        showBiography,
        handleCandidateSelect,
        handleConfirmVote,
        handleStartOver,
        handleVoteSuccess,
        toggleBiography
    } = useSelectCandidate();

    const {
        error: voteError,
        isSubmitting,
        submitVote
    } = useVoteSubmit();

    const {
        voterTurnout,
        loading: turnoutLoading,
        error: turnoutError
    } = useVoterTurnout(electionId);

    const {
        eligibility,
        loading: eligibilityLoading,
        error: eligibilityError
    } = useUserEligibility(electionId);

    const { formatDate, calculateDaysRemaining } = useElectionUtils();
    const daysRemaining = election ? calculateDaysRemaining(election.endDate) : 0;

    // combined loading and error states
    const isLoading = electionLoading || turnoutLoading || eligibilityLoading;
    const error = electionError || voteError || turnoutError || eligibilityError;

    const handleSubmitVote = async () => {
        const result = await submitVote(
            electionId,
            selectedCandidate.id,
            election.publicKey,
            user.address
        );

        if (result.success) {
            handleVoteSuccess();
        }
    };

    if (isLoading && !election) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto" />
                    <p className="mt-4 text-indigo-600 font-medium">
                        Loading election details...
                    </p>
                </div>
            </div>
        );
    }

    if (error && !election) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full text-center">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-800 mb-2">
                        Something went wrong
                    </h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {election && (
                <ElectionBanner
                    election={election}
                    formatDate={formatDate}
                    daysRemaining={daysRemaining}
                />
            )}

            <div className="max-w-4xl mx-auto px-4">
                <div className="mb-6">
                    {votingStep === "select" && election && (
                        <CandidateSelectionCard
                            election={election}
                            selectedCandidate={selectedCandidate}
                            handleCandidateSelect={handleCandidateSelect}
                            handleConfirmVote={handleConfirmVote}
                            showBiography={showBiography}
                            toggleBiography={toggleBiography}
                            eligibility={eligibility}
                        />
                    )}

                    {votingStep === "confirm" && election && (
                        <VoteConfirmationCard
                            election={election}
                            selectedCandidate={selectedCandidate}
                            formatDate={formatDate}
                            handleStartOver={handleStartOver}
                            handleSubmitVote={handleSubmitVote}
                            error={voteError}
                            isSubmitting={isSubmitting}
                        />
                    )}

                    {votingStep === "success" && election && (
                        <VoteSuccessCard
                            election={election}
                            selectedCandidate={selectedCandidate}
                        />
                    )}
                </div>

                {election && votingStep !== "success" && (
                    <div className="mb-6">
                        <TurnoutCard
                            totalVoters={voterTurnout?.totalVoters}
                            currentTurnout={voterTurnout?.currentTurnout}
                        />
                    </div>
                )}

                <FooterCard />
            </div>
        </div>
    );
};

export default ElectionVotePage;