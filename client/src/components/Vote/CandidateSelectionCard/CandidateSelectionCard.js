import React from 'react';
import { Info, Shield, Check, ArrowRight } from 'lucide-react';
import CandidateCard from '../../ElectionView/CandidateCard';

const CandidateSelectionCard = ({
                                    election,
                                    selectedCandidate,
                                    handleCandidateSelect,
                                    handleConfirmVote
                                }) => {
    return (
        <div className="max-w max-w-10xl mx-auto bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <div className="flex items-start p-4 mb-5 bg-indigo-50 border-l-4 border-indigo-400 rounded-r-lg">
                <Info size={20} className="mr-3 flex-shrink-0 text-indigo-500" />
                <div>
                    <h5 className="font-medium text-indigo-700 text-sm mb-1">How to Vote</h5>
                    <p className="text-sm text-gray-600">
                        Review candidates, select one by clicking their card, then confirm on the next screen.
                    </p>
                </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Shield className="text-indigo-600 mr-2" size={20} />
                Select a Candidate
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {election.candidates.map((candidate) => (
                    <div key={candidate.id}>
                        <div
                            className={`relative transition-all duration-200 ${
                                selectedCandidate?.id === candidate.id
                                    ? "ring-2 ring-indigo-500 rounded-lg shadow-md"
                                    : "border border-gray-200 hover:border-indigo-200 rounded-lg hover:shadow-md"
                            }`}
                            onClick={() => handleCandidateSelect(candidate)}
                            style={{ cursor: "pointer" }}
                        >
                            <CandidateCard candidate={candidate} />

                            <div
                                className={`flex justify-between items-center py-2.5 px-4 rounded-b-lg ${
                                    selectedCandidate?.id === candidate.id
                                        ? "bg-indigo-600 text-white"
                                        : "bg-gray-50 text-gray-500"
                                }`}
                            >
                <span className={`text-sm font-medium ${selectedCandidate?.id === candidate.id ? "text-white" : "text-gray-600"}`}>
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

            <div className="flex justify-center mt-8">
                <button
                    className={`px-6 py-2.5 rounded-full text-white text-sm font-medium shadow transition-colors flex items-center ${
                        selectedCandidate
                            ? "bg-indigo-600 hover:bg-indigo-700"
                            : "bg-gray-300 cursor-not-allowed"
                    }`}
                    disabled={!selectedCandidate}
                    onClick={handleConfirmVote}
                >
                    Continue to Confirm
                    <ArrowRight size={16} className="ml-2" />
                </button>
            </div>

            <div className="text-center mt-3">
                <p className="text-xs text-gray-500">
                    Your vote is secure and anonymous
                </p>
            </div>
        </div>
    );
};

export default CandidateSelectionCard;