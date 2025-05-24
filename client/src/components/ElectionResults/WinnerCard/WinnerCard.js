import { Award } from "lucide-react";

const WinnerCard = ({ winner }) => {
    return (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <div className="flex items-center">
                <div className="bg-amber-500 text-white rounded-full p-1 mr-3">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2L13.09 8.26L20 9L15 13.74L16.18 20.02L10 16.77L3.82 20.02L5 13.74L0 9L6.91 8.26L10 2Z" clipRule="evenodd" />
                    </svg>
                </div>
                <div>
                    <p className="text-sm text-gray-600 mb-1">Election Winner</p>
                    <h3 className="text-lg font-bold text-gray-800">{winner.name}</h3>
                    <p className="text-sm text-amber-700">{winner.voteCount} votes ({winner.percentage}%)</p>
                </div>
            </div>
        </div>
    );
};

export default WinnerCard;