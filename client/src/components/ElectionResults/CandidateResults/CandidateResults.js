import { useState } from "react";
import { ChevronDown, ChevronUp, User } from "lucide-react";
import CandidateResultCard from "./CandidateResultCard";

const CandidateResults = ({ candidates = [] }) => {
    const [sortBy, setSortBy] = useState("votes");
    const [sortOrder, setSortOrder] = useState("desc");

    const toggleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(field);
            setSortOrder("desc");
        }
    };

    const getSortIcon = (field) => {
        if (sortBy !== field) return null;
        return sortOrder === "asc" ? (
            <ChevronUp size={16} />
        ) : (
            <ChevronDown size={16} />
        );
    };

    // Sort candidates
    const sortedCandidates = [...candidates].sort((a, b) => {
        let comparison = 0;

        if (sortBy === "name") {
            comparison = a.name.localeCompare(b.name);
        } else if (sortBy === "votes") {
            comparison = (a.votes || 0) - (b.votes || 0);
        } else if (sortBy === "percentage") {
            comparison = (a.percentage || 0) - (b.percentage || 0);
        }

        return sortOrder === "asc" ? comparison : -comparison;
    });

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Candidate Results</h2>

            {candidates.length > 0 ? (
                <>
                    <div className="flex items-center justify-between mb-4 px-4 text-sm font-medium text-gray-500">
                        <button
                            className="flex items-center"
                            onClick={() => toggleSort("name")}
                        >
                            Candidate {getSortIcon("name")}
                        </button>
                        <div className="flex space-x-6">
                            <button
                                className="flex items-center"
                                onClick={() => toggleSort("votes")}
                            >
                                Votes {getSortIcon("votes")}
                            </button>
                            <button
                                className="flex items-center"
                                onClick={() => toggleSort("percentage")}
                            >
                                Percentage {getSortIcon("percentage")}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {sortedCandidates.map((candidate) => (
                            <CandidateResultCard key={candidate.id} candidate={candidate} />
                        ))}
                    </div>
                </>
            ) : (
                <div className="text-center py-8">
                    <User className="mx-auto text-gray-300 mb-3" size={48} />
                    <p className="text-gray-500">No candidate information available</p>
                </div>
            )}
        </div>
    );
};

export default CandidateResults;