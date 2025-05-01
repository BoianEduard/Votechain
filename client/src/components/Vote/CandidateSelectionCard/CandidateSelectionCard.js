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
            <div className="flex items-start p-3 mb-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                <Info size={20} className="mr-2 flex-shrink-0 text-blue-500" />
                <div>
                    <h5 className="font-medium text-blue-700 text-sm">How to Vote</h5>
                    <p className="text-sm text-gray-600">
                        Review candidates, select one by clicking their card, then confirm on the next screen.
                    </p>
                </div>
            </div>

            <h3 className="text-lg font-semibold mb-3">Select a Candidate</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
                {election.candidates.map((candidate) => (
                    <div key={candidate.id}>
                        <div
                            className={`relative transition-all duration-200 hover:shadow-md ${
                                selectedCandidate?.id === candidate.id
                                    ? "ring-2 ring-blue-500 rounded-lg shadow-md"
                                    : "hover:ring-1 hover:ring-gray-200 rounded-lg"
                            }`}
                            onClick={() => handleCandidateSelect(candidate)}
                            style={{ cursor: "pointer" }}
                        >
                            <CandidateCard candidate={candidate} />

                            <div
                                className={`flex justify-between items-center py-2 px-3 rounded-b-lg ${
                                    selectedCandidate?.id === candidate.id
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-50 text-gray-500"
                                }`}
                            >
                                <span className="text-sm">
                                    {selectedCandidate?.id === candidate.id ? "Selected" : "Select"}
                                </span>
                                {selectedCandidate?.id === candidate.id && (
                                    <Check size={16} className="text-white" />
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-center items-center mt-6">
                <div className="text-xs text-gray-500 flex items-center">
                </div>
                <button
                    className="px-5 py-2 rounded-full bg-blue-600 text-white text-sm font-medium shadow hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
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