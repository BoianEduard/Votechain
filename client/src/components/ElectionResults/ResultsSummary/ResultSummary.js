import { Award, Users, Clock } from "lucide-react";

const ResultSummary = ({ election }) => {
    const isFinished = new Date(election.endDate) < new Date();
    const hasWinner = election.winner;

    const getTimeInfo = () => {
        const now = new Date();
        const endDate = new Date(election.endDate);

        if (now < endDate) {
            const diffTime = Math.abs(endDate - now);
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

            return {
                label: "Time Remaining",
                value: `${diffDays}d ${diffHours}h`,
                icon: <Clock className="text-indigo-500" size={20} />
            };
        } else {
            const diffTime = Math.abs(now - endDate);
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            return {
                label: "Closed",
                value: `${diffDays} days ago`,
                icon: <Clock className="text-gray-500" size={20} />
            };
        }
    };

    const timeInfo = getTimeInfo();

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Results Summary</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Winner Card */}
                <div className="bg-indigo-50 rounded-lg p-4 flex items-start">
                    <Award className="text-indigo-600 mr-3 mt-1" size={24} />
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">
                            {isFinished ? "Winner" : "Leading Candidate"}
                        </h3>
                        <p className="font-semibold text-gray-800">
                            {hasWinner ? election.winner : "No clear winner yet"}
                        </p>
                    </div>
                </div>

                {/* Turnout Card */}
                <div className="bg-indigo-50 rounded-lg p-4 flex items-start">
                    <Users className="text-indigo-600 mr-3 mt-1" size={24} />
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Voter Turnout</h3>
                        <p className="font-semibold text-gray-800">
                            {election.turnoutPercentage || "N/A"}%
                        </p>
                        <p className="text-xs text-gray-500">
                            {election.totalVotes || 0} total votes
                        </p>
                    </div>
                </div>

                {/* Time Card */}
                <div className="bg-indigo-50 rounded-lg p-4 flex items-start">
                    {timeInfo.icon}
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-gray-500">{timeInfo.label}</h3>
                        <p className="font-semibold text-gray-800">{timeInfo.value}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultSummary;