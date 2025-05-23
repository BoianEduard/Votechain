import React from 'react';
import { BarChart2, Users } from 'lucide-react';

const TurnoutCard = ({ election }) => {
    const currentTurnout = election?.currentTurnout || 0;
    const totalVoters = election?.totalVoters || 0;
    const turnoutPercentage = totalVoters > 0 ? Math.round((currentTurnout / totalVoters) * 100) : 0;

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <div className="flex items-center mb-3">
                <BarChart2 className="text-indigo-600 mr-2" size={18} />
                <h4 className="text-lg font-semibold text-gray-800">Current Turnout</h4>
            </div>

            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                    <Users className="text-indigo-500 mr-2" size={16} />
                    <span className="text-sm text-gray-600">
            {currentTurnout} of {totalVoters} votes
          </span>
                </div>
                <span className="font-bold text-indigo-700">{turnoutPercentage}%</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className="bg-indigo-500 h-2 rounded-full"
                    style={{ width: `${turnoutPercentage}%` }}
                ></div>
            </div>
        </div>
    );
};

export default TurnoutCard;