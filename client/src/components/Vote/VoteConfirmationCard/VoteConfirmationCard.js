import React from 'react';
import { AlertTriangle, ArrowLeft, Check } from 'lucide-react';
import CandidateCard from '../../ElectionView/CandidateCard';

const VoteConfirmationCard = ({
                                  election,
                                  selectedCandidate,
                                  formatDate,
                                  handleStartOver,
                                  handleSubmitVote
                              }) => {
    return (
        <div className="card border-0 shadow-sm rounded-lg">
            <div className="card-header bg-light py-3 border-0">
                <h3 className="text-xl font-bold mb-0">Confirm Your Vote</h3>
            </div>
            <div className="card-body p-6">
                <div className="alert alert-warning d-flex items-start mb-6">
                    <AlertTriangle size={24} className="mr-3 flex-shrink-0 mt-1" />
                    <div>
                        <h5 className="font-bold">Please Review Carefully</h5>
                        <p className="mb-0">
                            Once submitted, your vote cannot be changed. Please verify your selection before confirming.
                        </p>
                    </div>
                </div>

                <div className="p-6 border rounded-3 mb-6">
                    <h4 className="text-lg font-bold mb-3">You are voting for:</h4>
                    <CandidateCard candidate={selectedCandidate} />
                </div>

                <div className="p-6 bg-light rounded-3 mb-6">
                    <h4 className="text-lg font-bold mb-3">Election Information</h4>
                    <p className="mb-2">
                        <strong>Title:</strong> {election.title}
                    </p>
                    <p className="mb-2">
                        <strong>Voting Period:</strong> {formatDate(election.startDate)} - {formatDate(election.endDate)}
                    </p>
                    <p className="mb-0">
                        <strong>Eligibility:</strong> {election.eligibilityType}
                    </p>
                </div>

                <div className="flex justify-between items-center">
                    <button
                        className="btn btn-outline-secondary d-flex items-center"
                        onClick={handleStartOver}
                    >
                        <ArrowLeft size={16} className="mr-2" />
                        Change Selection
                    </button>
                    <button
                        className="btn btn-success px-6 py-3 d-flex items-center"
                        onClick={handleSubmitVote}
                        style={{
                            borderRadius: "50px",
                            boxShadow: "0 4px 10px rgba(25, 135, 84, 0.25)"
                        }}
                    >
                        <Check size={18} className="mr-2" />
                        Confirm Vote
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VoteConfirmationCard;