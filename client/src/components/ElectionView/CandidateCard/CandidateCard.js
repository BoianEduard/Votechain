import React from 'react';
import {useEffect} from 'react';


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
                <img
                    src={candidate.imageUrl
                        ? `http://localhost:5001${candidate.imageUrl}`
                        : `http://localhost:5001/default.png`}
                    alt={candidate.name}
                    className="rounded-circle me-3"
                    style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        border: "2px solid #ccc",
                    }}
                />
                <div>
                    <h5 className="mb-1 fw-bold">{candidate.name}</h5>
                    <p className="text-secondary small mb-2">{candidate.position || "Candidate"}</p>
                    <p className="text-muted small mb-0">{candidate.description || "No description provided"}</p>
                </div>
            </div>
        </div>
    );
};

export default CandidateCard;