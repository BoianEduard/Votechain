import { Users, BarChart2, Percent } from "lucide-react";

const ElectionStatsCard =({ stats }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                <div className="flex items-center justify-center text-center">
                    <div className="w-full">
                        <Users className="text-blue-600 mx-auto mb-1" size={18} />
                        <p className="text-xs text-gray-600 mb-1">Eligible Voters</p>
                        <p className="text-lg font-bold text-gray-800">{stats.totalEligibleVoters}</p>
                    </div>
                </div>
            </div>
            <div className="bg-green-50 border border-green-100 rounded-lg p-3">
                <div className="flex items-center justify-center text-center">
                    <div className="w-full">
                        <BarChart2 className="text-green-600 mx-auto mb-1" size={18} />
                        <p className="text-xs text-gray-600 mb-1">Votes Cast</p>
                        <p className="text-lg font-bold text-gray-800">{stats.totalVotesCast}</p>
                    </div>
                </div>
            </div>
            <div className="bg-purple-50 border border-purple-100 rounded-lg p-3">
                <div className="flex items-center justify-center text-center">
                    <div className="w-full">
                        <Percent className="text-purple-600 mx-auto mb-1" size={18} />
                        <p className="text-xs text-gray-600 mb-1">Participation</p>
                        <p className="text-lg font-bold text-gray-800">{stats.participationRate.toFixed(2)}%</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ElectionStatsCard;