import React from 'react';

const CandidateCard = ({ candidate }) => {
    return (
        <div
            className="p-3 h-full rounded-3xl border transition-all duration-200 ease-in-out bg-white shadow-md cursor-pointer"
            onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-3px)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
        >
            <div className="flex">
                <img
                    src={candidate.imageUrl
                        ? `http://localhost:5001${candidate.imageUrl}`
                        : `http://localhost:5001/uploads/candidates/default_candidate.png`}
                    alt={candidate.name}
                    className="rounded-full mr-3"
                    style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        border: "2px solid #ccc",
                    }}
                />
                <div>
                    <h5 className="mb-1 font-semibold">{candidate.name}</h5>
                    <p className="text-gray-500 text-sm mb-2">{candidate.position || "Candidate"}</p>
                    <p className="text-gray-600 text-sm mb-0">{candidate.description || "No description provided"}</p>
                </div>
            </div>
        </div>
    );
};

export default CandidateCard;
