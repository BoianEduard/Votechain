import { BarChart2 } from "lucide-react";

const CandidateResultsCard = ({ result }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
            <div className="flex items-center mb-3">
                <BarChart2 className="text-indigo-600 mr-2" size={18} />
                <h3 className="text-base font-semibold text-gray-800">Candidate Results</h3>
            </div>

            {result.candidates && result.candidates.length > 0 ? (
                <div className="space-y-3">
                    {result.candidates.map((candidate) => (
                        <div
                            key={candidate.id}
                            className="border-b border-gray-100 pb-3 last:border-b-0"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                    <img
                                        src={
                                            candidate.imageUrl
                                                ? `http://localhost:5001${candidate.imageUrl}`
                                                : `http://localhost:5001/uploads/candidates/default_candidate.png`
                                        }
                                        alt={candidate.name}
                                        className="rounded-full mr-3"
                                        style={{
                                            width: "60px",
                                            height: "60px",
                                            objectFit: "cover",
                                            border: "2px solid #ccc",
                                        }}
                                    />
                                    <div>
                                        <h4 className="font-medium text-gray-800 text-sm">
                                            {candidate.name}
                                        </h4>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-base font-bold text-indigo-700">
                                        {candidate.percentage}%
                                    </span>
                                    <p className="text-xs text-gray-500">
                                        {candidate.voteCount} votes
                                    </p>
                                </div>
                            </div>

                            <div className="bg-gray-200 h-1.5 rounded-full w-full">
                                <div
                                    className={`h-1.5 rounded-full ${
                                        result.winner && candidate.id === result.winner.id
                                            ? "bg-amber-500"
                                            : "bg-indigo-500"
                                    }`}
                                    style={{ width: `${candidate.percentage || 0}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 text-center py-3 text-sm">
                    No candidate information available
                </p>
            )}
        </div>
    );
};

export default CandidateResultsCard;