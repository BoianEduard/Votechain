import { User } from "lucide-react";

const CandidateResultCard = ({ candidate }) => {
    const percentage = candidate.percentage || 0;
    const isWinner = candidate.isWinner;

    return (
        <div className={`rounded-lg border ${isWinner ? 'border-indigo-200 bg-indigo-50' : 'border-gray-200'} p-4`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    {candidate.avatar ? (
                        <img
                            src={candidate.avatar}
                            alt={candidate.name}
                            className="w-10 h-10 rounded-full mr-3 object-cover"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                            <User className="text-indigo-600" size={20} />
                        </div>
                    )}
                    <div>
                        <h4 className="font-medium text-gray-800">
                            {candidate.name}
                            {isWinner && (
                                <span className="ml-2 text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                  Winner
                </span>
                            )}
                        </h4>
                        <p className="text-sm text-gray-500">{candidate.party || "Independent"}</p>
                    </div>
                </div>

                <div className="text-right">
                    <div className="font-bold text-gray-800">{candidate.votes || 0}</div>
                    <div className="text-sm font-medium text-gray-500">{percentage.toFixed(1)}%</div>
                </div>
            </div>

            <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className={`h-2 rounded-full ${isWinner ? 'bg-indigo-600' : 'bg-indigo-400'}`}
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default CandidateResultCard;