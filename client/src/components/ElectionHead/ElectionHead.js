import React from "react";
import { Calendar, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { format, differenceInDays } from "date-fns";

const ElectionHead = ({ election, expanded, toggleExpand }) => {
    const formatDate = (dateString) => {
        return format(new Date(dateString), "MMMM d, yyyy");
    };

    const daysRemaining = differenceInDays(new Date(election.endDate), new Date());

    return (
        <div
            className={`p-5 bg-blue-50 cursor-pointer transition-all duration-300 ${expanded ? "border-b" : ""}`}
            onClick={toggleExpand}
        >
            <div className="flex justify-between items-center">
                <div className="flex flex-col">
                    <h3 className="text-2xl font-bold text-gray-800">{election.title}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Calendar className="mr-2" size={14} />
                        <span>
                            {formatDate(election.startDate)} - {formatDate(election.endDate)}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        daysRemaining > 0 ? "bg-green-500 text-white" : "bg-red-500 text-white"
                    }`}>
                        <Clock size={12} className="inline-block mr-1" />
                        {daysRemaining > 0 ? `${daysRemaining} days left` : "Closed"}
                    </div>

                    <button
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-md border border-gray-300"
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleExpand();
                        }}
                        aria-expanded={expanded}
                    >
                        {expanded ? (
                            <ChevronUp size={18} className="text-blue-600" />
                        ) : (
                            <ChevronDown size={18} className="text-blue-600" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ElectionHead;