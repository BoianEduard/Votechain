import React, { useState } from 'react';
import { AlertTriangle, ArrowLeft, Check, XCircle } from 'lucide-react';

import CandidateCard from '../../ElectionView/CandidateCard';

const VoteConfirmationCard = ({
                                  election,
                                  selectedCandidate,
                                  formatDate,
                                  handleStartOver,
                                  handleSubmitVote,
                                  error
                              }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmitVote = async () => {
        setIsSubmitting(true);
        try {
            await handleSubmitVote();
        } catch (error) {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="bg-gray-50 py-3 px-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold">Confirm Your Vote</h3>
            </div>
            <div className="p-4">
                <div className="flex items-start p-3 mb-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg">
                    <AlertTriangle size={18} className="mr-2 flex-shrink-0 text-amber-500" />
                    <div>
                        <h5 className="font-medium text-amber-700 text-sm">Please Review Carefully</h5>
                        <p className="text-sm text-amber-700">
                            Once submitted, your vote cannot be changed. Verify your selection before confirming.
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="flex items-start p-3 mb-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                        <XCircle size={18} className="mr-2 flex-shrink-0 text-red-500" />
                        <div>
                            <h5 className="font-medium text-red-700 text-sm">Error</h5>
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                )}

                <div className="mb-4 border border-gray-100 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">You are voting for:</h4>
                    <CandidateCard candidate={selectedCandidate} />
                </div>

                <div className="flex justify-between items-center pt-2">
                    <button
                        className="flex items-center px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 transition"
                        onClick={handleStartOver}
                        disabled={isSubmitting}
                    >
                        <ArrowLeft size={14} className="mr-1.5" />
                        Change Selection
                    </button>
                    <button
                        className={`flex items-center px-4 py-2 ${
                            isSubmitting ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
                        } text-white rounded-full text-sm font-medium shadow-sm transition`}
                        onClick={onSubmitVote}
                        disabled={isSubmitting}
                    >
                        <Check size={15} className="mr-1.5" />
                        {isSubmitting ? 'Processing...' : 'Confirm Vote'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VoteConfirmationCard;