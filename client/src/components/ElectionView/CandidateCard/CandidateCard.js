import React from 'react';
import { Award } from 'lucide-react';

const CandidateCard = ({ candidate }) => {
    return (
        <div
            className="p-3 h-100 rounded-3 border"
            style={{
                transition: "all 0.2s ease",
                background: "white",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                cursor: "pointer"
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-3px)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
        >
            <div className="d-flex">
                <div
                    className="rounded-circle p-2 me-3 d-flex align-items-center justify-content-center"
                    style={{
                        background: "rgba(114, 9, 183, 0.1)",
                        width: "40px",
                        height: "40px"
                    }}
                >
                    <Award size={20} className="text-secondary" />
                </div>
                <div>
                    <h5 className="mb-1 fw-bold">{candidate.name}</h5>
                    <p className="text-secondary small mb-2">{candidate.position}</p>
                    <p className="text-muted small mb-0">{candidate.description}</p>
                </div>
            </div>
        </div>
    );
};

export default CandidateCard;