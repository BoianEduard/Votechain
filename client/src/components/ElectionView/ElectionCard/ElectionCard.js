import React, { useState } from "react";
import { Users, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import CandidateCard from "../CandidateCard";
import ElectionHead from "../../ElectionHead";

const ElectionCard = ({ election }) => {
    const [expanded, setExpanded] = useState(false);

    const toggleExpand = () => setExpanded((prev) => !prev);

    return (
        <div className="w-full flex justify-center mb-6">
            <div className="border rounded-2xl shadow-md bg-white w-full max-w-4xl transition-all duration-300 overflow-hidden">
                <ElectionHead
                    election={election}
                    expanded={expanded}
                    toggleExpand={toggleExpand}
                />

                <div
                    className={`transition-all duration-500 ease-in-out overflow-hidden ${
                        expanded ? "max-h-[3000px] p-6 border-t" : "max-h-0 p-0"
                    }`}
                >
                    <div className="mb-6 p-4 rounded-lg bg-gray-100">
                        <p className="text-gray-700">{election.description}</p>
                    </div>

                    <div className="flex items-center mb-4 pb-3 border-b">
                        <Users className="text-blue-600 mr-2" size={18} />
                        <span className="font-semibold text-gray-700">
                            {election.candidates.length} Candidates
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {election.candidates.map((candidate) => (
                            <div key={candidate.id}>
                                <CandidateCard candidate={candidate} />
                            </div>
                        ))}
                    </div>

                    <div className="text-right">
                        <Link
                            to={`/elections/${election.id}/vote`}
                            className="inline-flex items-center px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition"
                        >
                            View Details & Vote
                            <ExternalLink size={16} className="ml-2" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ElectionCard;