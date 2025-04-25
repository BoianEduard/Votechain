import React from 'react';
import { Info, Shield, Check } from 'lucide-react';
import CandidateCard from '../../ElectionView/CandidateCard';

const CandidateSelectionCard = ({
                                    election,
                                    selectedCandidate,
                                    handleCandidateSelect,
                                    handleConfirmVote
                                }) => {
    return (
        <>
            <div className="alert alert-info d-flex align-items-start">
                <Info size={24} className="me-3 flex-shrink-0 mt-1" />
                <div>
                    <h5 className="fw-bold">How to Vote</h5>
                    <p className="mb-0">
                        Review each candidate's information carefully. Click on a candidate card to select them, then confirm your vote on the next screen.
                    </p>
                </div>
            </div>

            <h3 className="h4 fw-bold mb-3">Select a Candidate</h3>

            <div className="row g-4 mb-4">
                {election.candidates.map((candidate) => (
                    <div className="col-lg-4" key={candidate.id}>
                        <div
                            className={`position-relative ${selectedCandidate?.id === candidate.id ? "border border-3 border-primary rounded-3" : ""}`}
                            onClick={() => handleCandidateSelect(candidate)}
                            style={{ cursor: "pointer" }}
                        >
                            <CandidateCard candidate={candidate} />

                            <div
                                className={`card-footer border-0 d-flex justify-content-between align-items-center ${
                                    selectedCandidate?.id === candidate.id ? "bg-primary" : "bg-light"
                                }`}
                                style={{ borderRadius: "0 0 12px 12px" }}
                            >
                                <span className={selectedCandidate?.id === candidate.id ? "text-white" : "text-muted"}>
                                    {selectedCandidate?.id === candidate.id ? "Selected" : "Select to vote"}
                                </span>
                                {selectedCandidate?.id === candidate.id && (
                                    <Check size={20} className="text-white" />
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="d-flex justify-content-between align-items-center mt-4">
                <div className="text-muted">
                    <Shield size={16} className="me-1" />
                    <small>Your vote is secure and anonymous</small>
                </div>
                <button
                    className="btn btn-primary px-4 py-2"
                    disabled={!selectedCandidate}
                    onClick={handleConfirmVote}
                    style={{
                        borderRadius: "50px",
                        boxShadow: selectedCandidate
                            ? "0 4px 10px rgba(13, 110, 253, 0.25)"
                            : "none"
                    }}
                >
                    Continue to Confirm
                </button>
            </div>
        </>
    );
};

export default CandidateSelectionCard;
