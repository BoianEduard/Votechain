import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from 'react-redux';
import ElectionBanner from '../../components/Vote/ElectionBanner';
import CandidateSelectionCard from '../../components/Vote/CandidateSelectionCard';
import VoteConfirmationCard from '../../components/Vote/VoteConfirmationCard';
import VoteSuccessCard from '../../components/Vote/VoteSuccessCard'
import TurnoutCard from '../../components/Vote/TurnoutCard';
import FooterCard from '../../components/Commons/FooterCard';
import {fetchElectionDetails} from "../../redux/thunks/electionThunks";

const VotingPage = () => {
  const { electionId } = useParams();
  const [election, setElection] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [votingStep, setVotingStep] = useState("select");
  const [isLoading, setIsLoading] = useState(true);
  const [showBiography, setShowBiography] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setElection(await dispatch(fetchElectionDetails(electionId)));
      } catch (err) {
        console.error("Failed to fetch election:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [electionId, dispatch]);

  const formatDate = (dateString) =>
      new Date(dateString).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
      });

  const daysRemaining = election
      ? Math.ceil(
          (new Date(election.endDate) - new Date()) / (1000 * 60 * 60 * 24)
      )
      : 0;

  const handleCandidateSelect = (candidate) => {
    setSelectedCandidate(candidate);
  };

  const handleConfirmVote = () => {
    setVotingStep("confirm");
  };

  const handleSubmitVote = () => {
    setTimeout(() => {
      setVotingStep("success");
    }, 1500);
  };

  const handleStartOver = () => {
    setSelectedCandidate(null);
    setVotingStep("select");
  };

  const toggleBiography = (candidateId) => {
    if (showBiography === candidateId) {
      setShowBiography(null);
    } else {
      setShowBiography(candidateId);
    }
  };

  if (isLoading) {
    return (
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading election details...</p>
        </div>
    );
  }

  return (
      <div className="container py-5">
        <div className="mb-4">
          {election && (
              <ElectionBanner
                  election={election}
                  formatDate={formatDate}
                  daysRemaining={daysRemaining}
              />
          )}

          {votingStep === "select" && election && (
              <CandidateSelectionCard
                  election={election}
                  selectedCandidate={selectedCandidate}
                  handleCandidateSelect={handleCandidateSelect}
                  handleConfirmVote={handleConfirmVote}
                  showBiography={showBiography}
                  toggleBiography={toggleBiography}
              />
          )}

          {votingStep === "confirm" && election && (
              <VoteConfirmationCard
                  election={election}
                  selectedCandidate={selectedCandidate}
                  formatDate={formatDate}
                  handleStartOver={handleStartOver}
                  handleSubmitVote={handleSubmitVote}
              />
          )}

          {votingStep === "success" && election && (
              <VoteSuccessCard
                  election={election}
                  selectedCandidate={selectedCandidate}
              />
          )}
        </div>

        {election && <TurnoutCard election={election} />}

        <FooterCard />
      </div>
  );
};

export default VotingPage;
