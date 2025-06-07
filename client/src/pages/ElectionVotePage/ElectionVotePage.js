import React, { useState, useEffect } from "react";
import { useParams }                 from "react-router-dom";
import { useDispatch, useSelector }  from "react-redux";
import { AlertCircle }               from "lucide-react";
import ElectionBanner       from "../../components/Vote/ElectionBanner";
import CandidateSelectionCard from "../../components/Vote/CandidateSelectionCard";
import VoteConfirmationCard  from "../../components/Vote/VoteConfirmationCard";
import VoteSuccessCard       from "../../components/Vote/VoteSuccessCard";
import TurnoutCard           from "../../components/Vote/TurnoutCard";
import FooterCard            from "../../components/Commons/FooterCard";
import * as contractThunks   from "../../redux/thunks/contractThunks";
import { fetchElectionDetails, getVoterTurnout } from "../../redux/thunks/electionThunks";
import * as userThunks       from "../../redux/thunks/userThunks";

const ElectionVotePage = () => {
    const { electionId } = useParams();
    const dispatch       = useDispatch();

    const user           = useSelector(s => s.user.userData);
    const election       = useSelector(s => s.election.selectedElection);
    const voterTurnout   = useSelector(s => s.election.voterTurnout);

    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [votingStep, setVotingStep]    = useState("select");
    const [isLoading, setIsLoading]      = useState(true);
    const [showBiography, setShowBiography] = useState(null);
    const [error, setError]              = useState(null);
    const [eligibility, setEligibility]  = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                await dispatch(fetchElectionDetails(electionId));

                if (user?.id) {
                    const resp = await dispatch(userThunks.checkEligibility(electionId));
                    setEligibility(resp);
                }

                await dispatch(getVoterTurnout(electionId));
            } catch (err) {
                console.error("Failed to load election page:", err); //debug
                setError("Failed to load data. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [electionId, user, dispatch]);

    // util
    const formatDate = (d) =>
        new Date(d).toLocaleDateString("en-US", {
            month: "long", day: "numeric", year: "numeric"
        });

    const daysRemaining = election
        ? Math.ceil(
            (new Date(election.endDate) - new Date()) / (1000 *60*60*24)
        )
        : 0;

    //set the selected the candidate
    const handleCandidateSelect = (c) => setSelectedCandidate(c);

    const handleConfirmVote = () => setVotingStep("confirm");
    const handleStartOver   = () => {
        setSelectedCandidate(null);
        setVotingStep("select");
    };

    const handleSubmitVote = async () => {
        try {
            setError(null);
            await dispatch(
                contractThunks.castVote(
                    electionId,
                    selectedCandidate.id,
                    election.publicKey,
                    user.address
                )
            );
            setVotingStep("success");
        } catch (err) {
            console.error("Failed to submit vote:", err);
            setError("Failed to submit vote. Please try again.");
        }
    };

    const toggleBiography = (candId) => setShowBiography(showBiography === candId ? null : candId);

    if (isLoading) {
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
                            error={error}
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
                            totalVoters={voterTurnout.totalVoters}
                            currentTurnout={voterTurnout.currentTurnout}
                        />
                    </div>
                )}

                <FooterCard />
            </div>
        </div>
    );
};

export default ElectionVotePage;