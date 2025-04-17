import React, { useState } from "react";
import { Users, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import ElectionHead from '../../ElectionHead';
import CandidateCard from '../CandidateCard';

const ElectionCard = ({ election }) => {
    const [expanded, setExpanded] = useState(false);

    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    return (
        <div
            className="card shadow-sm mb-4 fade-in"
            style={{ transition: "all 0.3s ease" }}
        >
            <ElectionHead
                election={election}
                expanded={expanded}
                toggleExpand={toggleExpand}
            />

            {expanded && (
                <div className="card-body p-4 fade-in">
                    <div className="mb-4 p-3 rounded-3 bg-secondary-light">
                        <p className="text-secondary mb-0">{election.description}</p>
                    </div>

                    <div className="d-flex align-items-center mb-3 pb-2 border-bottom">
                        <Users className="text-primary me-2" size={18} />
                        <span className="fw-medium">{election.candidates.length} Candidates</span>
                    </div>

                    <div className="row g-3 mb-4">
                        {election.candidates.map((candidate) => (
                            <div key={candidate.id} className="col-md-6">
                                <CandidateCard candidate={candidate} />
                            </div>
                        ))}
                    </div>

                    <div className="text-end">
                        <Link
                            to={`/elections/${election.id}/vote`}
                            className="btn btn-primary px-4 py-2 d-inline-flex align-items-center"
                            style={{
                                borderRadius: "50px",
                                boxShadow: "0 4px 10px rgba(67, 97, 238, 0.25)"
                            }}
                        >
                            View Details & Vote
                            <ExternalLink size={16} className="ms-2" />
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ElectionCard;
