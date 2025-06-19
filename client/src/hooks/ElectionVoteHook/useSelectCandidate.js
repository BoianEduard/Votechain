import { useState } from "react";

export const useSelectCandidate = () => {
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [votingStep, setVotingStep] = useState("select");
    const [showBiography, setShowBiography] = useState(null);

    const handleCandidateSelect = (candidate) => {
        setSelectedCandidate(candidate);
    };

    const handleConfirmVote = () => {
        setVotingStep("confirm");
    };

    const handleStartOver = () => {
        setSelectedCandidate(null);
        setVotingStep("select");
    };

    const handleVoteSuccess = () => {
        setVotingStep("success");
    };

    const toggleBiography = (candidateId) => {
        setShowBiography(showBiography === candidateId ? null : candidateId);
    };

    return {
        selectedCandidate,
        votingStep,
        showBiography,
        handleCandidateSelect,
        handleConfirmVote,
        handleStartOver,
        handleVoteSuccess,
        toggleBiography
    };
};