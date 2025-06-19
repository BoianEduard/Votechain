import { Calendar, ChevronDown, ChevronUp } from "lucide-react";
import React from "react";

const ElectionHead = ({ election, expanded, toggleExpand }) => {
    const getStatus = () => {
        const now = new Date();
        if (new Date(election.startDate) > now) return "Not Started";
        if (new Date(election.endDate) < now) return "Closed";
        return "Vote In Progress";
    };

    const status = getStatus();
    const statusClass =
        status === "Vote In Progress"
            ? "bg-green-100 text-green-800"
            : status === "Not Started"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-700";

    return (
        <div className="p-6 cursor-pointer" onClick={toggleExpand}>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-semibold text-indigo-700 mb-2">
                        {election.title}
                    </h3>
                    <div className="flex items-center text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span className="text-sm">
              {new Date(election.startDate).toLocaleDateString()} - {new Date(election.endDate).toLocaleDateString()}
            </span>
                    </div>
                </div>

                <div className="flex items-center">
          <span className={`px-3 py-1 text-sm rounded-full mr-3 ${statusClass}`}>
            {status}
          </span>
                    <button
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label={expanded ? "Collapse" : "Expand"}
                    >
                        {expanded ? (
                            <ChevronUp className="text-gray-500" size={20} />
                        ) : (
                            <ChevronDown className="text-gray-500" size={20} />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ElectionHead;