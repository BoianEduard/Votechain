import React, { useState } from "react";
import { Users, ExternalLink, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import CandidateCard from '../CandidateCard';

const ElectionCard = ({ election }) => {
    const [expanded, setExpanded] = useState(false);

    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    return (
        <div className="border rounded-lg shadow-sm mb-4 transition-all duration-300 ease-in-out bg-white">
            <div
                className="p-4 flex items-center justify-between cursor-pointer"
                onClick={toggleExpand}
            >
                <div>
                    <h3 className="text-xl font-medium mb-1">{election.title}</h3>
                    <div className="flex items-center text-gray-500">
                        <Clock size={16} className="mr-1" />
                        <span>March 30, 2025 - March 31, 2025</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-red-500 text-white px-3 py-1 rounded-md text-sm font-medium">
                        Closed
                    </div>
                    <button className="text-blue-500">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
                        >
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>
                </div>
            </div>

            {expanded && (
                <div className="p-4 border-t fade-in">
                    <div className="mb-4 p-3 rounded-lg bg-gray-50">
                        <p className="text-gray-600 mb-0">{election.description}</p>
                    </div>

                    <div className="flex items-center mb-3 pb-2 border-b">
                        <Users className="text-blue-500 mr-2" size={18} />
                        <span className="font-medium">{election.candidates.length} Candidates</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        {election.candidates.map((candidate) => (
                            <div key={candidate.id}>
                                <CandidateCard candidate={candidate} />
                            </div>
                        ))}
                    </div>

                    <div className="text-right">
                        <Link
                            to={`/elections/${election.id}/vote`}
                            className="px-4 py-2 inline-flex items-center rounded-full bg-blue-500 hover:bg-blue-600 text-white"
                        >
                            View Details & Vote
                            <ExternalLink size={16} className="ml-2" />
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ElectionCard;