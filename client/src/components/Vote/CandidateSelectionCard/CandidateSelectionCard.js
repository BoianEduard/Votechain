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
            <div className="alert alert-info flex items-start mb-4 p-4 bg-blue-100 border border-blue-300 rounded-lg">
                <Info size={24} className="mr-3 flex-shrink-0 mt-1 text-blue-600" />
                <div>
                    <h5 className="font-semibold text-blue-600">How to Vote</h5>
                    <p className="text-gray-700">
                        Review each candidate's information carefully. Click on a candidate card to select them, then confirm your vote on the next screen.
                    </p>
                </div>
            </div>

            <h3 className="text-xl font-bold mb-4">Select a Candidate</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {election.candidates.map((candidate) => (
                    <div className="col" key={candidate.id}>
                        <div
                            className={`relative ${selectedCandidate?.id === candidate.id ? "border-3 border-blue-500 rounded-lg" : ""}`}
                            onClick={() => handleCandidateSelect(candidate)}
                            style={{ cursor: "pointer" }}
                        >
                            <CandidateCard candidate={candidate} />

                            <div
                                className={`card-footer flex justify-between items-center p-3 rounded-b-lg ${
                                    selectedCandidate?.id === candidate.id ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600"
                                }`}
                            >
                                <span>
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

            <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-500 flex items-center">
                    <Shield size={16} className="mr-2" />
                    <small>Your vote is secure and anonymous</small>
                </div>
                <button
                    className="btn btn-primary px-6 py-3 rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-700 disabled:opacity-50"
                    disabled={!selectedCandidate}
                    onClick={handleConfirmVote}
                >
                    Continue to Confirm
                </button>
            </div>
        </>
    );
};

export default CandidateSelectionCard;