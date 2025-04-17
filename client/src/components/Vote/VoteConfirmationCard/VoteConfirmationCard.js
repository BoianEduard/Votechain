import React from 'react';
import { AlertTriangle, ArrowLeft, Check } from 'lucide-react';

const VoteConfirmationCard = ({
                              election,
                              selectedCandidate,
                              formatDate,
                              handleStartOver,
                              handleSubmitVote
                          }) => {
    return (
        <div className="card border-0 shadow-sm" style={{ borderRadius: "12px" }}>
            <div className="card-header bg-light py-3 border-0">
                <h3 className="h4 fw-bold mb-0">Confirm Your Vote</h3>
            </div>
            <div className="card-body p-4">
                <div className="alert alert-warning d-flex align-items-start mb-4">
                    <AlertTriangle size={24} className="me-3 flex-shrink-0 mt-1" />
                    <div>
                        <h5 className="fw-bold">Please Review Carefully</h5>
                        <p className="mb-0">
                            Once submitted, your vote cannot be changed. Please verify your selection before confirming.
                        </p>
                    </div>
                </div>

                <div className="p-4 border rounded-3 mb-4">
                    <h4 className="h5 fw-bold mb-3">You are voting for:</h4>
                    <div className="d-flex align-items-center">
                        <img
                            src={selectedCandidate.image}
                            alt={selectedCandidate.name}
                            className="rounded-circle me-3"
                            style={{ width: "60px", height: "60px" }}
                        />
                        <div>
                            <h5 className="h5 fw-bold mb-1">{selectedCandidate.name}</h5>
                            <p className="text-primary mb-0">{selectedCandidate.position}</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-light rounded-3 mb-4">
                    <h4 className="h5 fw-bold mb-3">Election Information</h4>
                    <p className="mb-2">
                        <strong>Title:</strong> {election.title}
                    </p>
                    <p className="mb-2">
                        <strong>Voting Period:</strong> {formatDate(election.startDate)} - {formatDate(election.endDate)}
                    </p>
                    <p className="mb-0">
                        <strong>Eligibility:</strong> {election.eligibilityRequirements}
                    </p>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                    <button
                        className="btn btn-outline-secondary d-flex align-items-center"
                        onClick={handleStartOver}
                    >
                        <ArrowLeft size={16} className="me-2" />
                        Change Selection
                    </button>
                    <button
                        className="btn btn-success px-4 py-2 d-flex align-items-center"
                        onClick={handleSubmitVote}
                        style={{
                            borderRadius: "50px",
                            boxShadow: "0 4px 10px rgba(25, 135, 84, 0.25)"
                        }}
                    >
                        <Check size={18} className="me-2" />
                        Confirm Vote
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VoteConfirmationCard;
