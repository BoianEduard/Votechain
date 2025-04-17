import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ElectionBanner from '../../components/Vote/ElectionBanner';
import CandidateSelectionCard from '../../components/Vote/CandidateSelectionCard';
import VoteConfirmationCard from '../../components/Vote/VoteConfirmationCard';
import VoteSuccessCard from '../../components/Vote/VoteSuccessCard'
import TurnoutCard from '../../components/Vote/TurnoutCard';
import FooterCard from '../../components/Commons/FooterCard';

const VotingPage = () => {
  const { electionId } = useParams();
  const [election, setElection] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [votingStep, setVotingStep] = useState("select"); // select, confirm, success
  const [isLoading, setIsLoading] = useState(true);
  const [showBiography, setShowBiography] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setElection({
        id: electionId,
        title: "City Council Election 2024",
        description: "Annual election for city council representatives for District 3. The elected council member will serve a 4-year term and be responsible for local policy decisions, budget approval, and community development initiatives.",
        startDate: "2024-06-01",
        endDate: "2024-06-15",
        candidates: [
          {
            id: "c1",
            name: "Jane Smith",
            position: "Council Member, District 3",
            description: "Experienced local community leader with 10+ years of public service",
            biography: "Jane Smith has served the community for over a decade through various public service roles. As a former Parks Department director, she led initiatives that revitalized three neighborhood parks and established the annual Community Green Festival. Jane holds a Master's in Public Administration and has received multiple commendations for her work in community engagement. If elected, she plans to focus on sustainable urban development, affordable housing, and expanding public transportation options.",
            image: "https://randomuser.me/api/portraits/women/44.jpg",
            platform: [
              "Increase affordable housing by 15% over 4 years",
              "Expand public transportation to underserved neighborhoods",
              "Implement green infrastructure in all new development projects",
              "Create a small business incubator program"
            ]
          },
          {
            id: "c2",
            name: "John Doe",
            position: "Council Member, District 3",
            description: "Small business owner committed to local economic development",
            biography: "John Doe is a lifelong resident of District 3 and has owned a successful local bookstore for 15 years. His business has created over 20 jobs and serves as a community hub for literary events. John graduated from State University with a degree in Business and Economics. His experience navigating small business challenges during economic downturns has given him insight into the needs of local entrepreneurs. John believes in fiscal responsibility while investing in critical community services.",
            image: "https://randomuser.me/api/portraits/men/32.jpg",
            platform: [
              "Reduce regulations for small businesses",
              "Implement tax incentives for businesses that hire locally",
              "Increase funding for public safety programs",
              "Create a downtown revitalization plan"
            ]
          },
          {
            id: "c3",
            name: "Maria Garcia",
            position: "Council Member, District 3",
            description: "Education advocate and former school board member",
            biography: "Maria Garcia served on the local school board for 8 years, where she championed educational equity initiatives and after-school programs. She has a background in education policy and currently works as a consultant helping schools implement innovative teaching methods. Maria earned her PhD in Education from National University. Her research on community-school partnerships has been published in several academic journals. Maria is passionate about ensuring all residents have access to quality education and city services.",
            image: "https://randomuser.me/api/portraits/women/68.jpg",
            platform: [
              "Establish a youth council to advise on city policies",
              "Create more community centers in underserved areas",
              "Implement participatory budgeting for neighborhood projects",
              "Expand library services and hours"
            ]
          }
        ],
        votingMethod: "Ranked Choice",
        eligibilityRequirements: "Must be a registered resident of District 3 and at least 18 years of age.",
        voterTurnout: {
          previous: "64%",
          target: "75%"
        }
      });
      setIsLoading(false);
    }, 1000);
  }, [electionId]);

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
          <ElectionBanner
              election={election}
              formatDate={formatDate}
              daysRemaining={daysRemaining}
          />

          {votingStep === "select" && (
              <CandidateSelectionCard
                  election={election}
                  selectedCandidate={selectedCandidate}
                  handleCandidateSelect={handleCandidateSelect}
                  handleConfirmVote={handleConfirmVote}
                  showBiography={showBiography}
                  toggleBiography={toggleBiography}
              />
          )}

          {votingStep === "confirm" && (
              <VoteConfirmationCard
                  election={election}
                  selectedCandidate={selectedCandidate}
                  formatDate={formatDate}
                  handleStartOver={handleStartOver}
                  handleSubmitVote={handleSubmitVote}
              />
          )}

          {votingStep === "success" && (
              <VoteSuccessCard
                  election={election}
                  selectedCandidate={selectedCandidate}
              />
          )}
        </div>

        <TurnoutCard election={election} />
        <FooterCard />
      </div>
  );
};

export default VotingPage;
