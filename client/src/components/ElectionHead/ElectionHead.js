import React from 'react';
import { Calendar, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

const ElectionHead = ({ election, expanded, toggleExpand }) => {
    const formatDate = (dateString) => {
        return format(new Date(dateString), 'MMMM d, yyyy');
    };

    const daysRemaining = differenceInDays(new Date(election.endDate), new Date());

    return (
        <div
            className={`card-header py-3 ${expanded ? "border-b-0" : ""} bg-primary-light cursor-pointer transition-all duration-300 ease-in-out`}
            onClick={toggleExpand}
        >
            <div className="flex justify-between items-center">
                <div className="flex items-center flex-grow">
                    <div
                        className="rounded-full me-3 flex items-center justify-center"
                        style={{
                            width: "40px",
                            height: "40px",
                            background: "rgba(255,255,255,0.7)",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
                        }}
                    >
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-0">{election.title}</h3>
                        <div className="flex items-center text-muted text-sm mt-1">
                            <Calendar className="me-1" size={12} />
                            <span>{formatDate(election.startDate)} - {formatDate(election.endDate)}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center">
                    <span
                        className={`badge rounded-full me-3 ${daysRemaining > 0 ? "bg-green-500" : "bg-red-500"}`}
                        style={{
                            padding: "0.5rem 0.75rem",
                            fontSize: "0.75rem",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                        }}
                    >
                        <Clock size={12} className="me-1" />
                        {daysRemaining > 0 ? `${daysRemaining} days left` : "Closed"}
                    </span>
                    <button
                        className="btn btn-sm rounded-full flex items-center justify-center w-8 h-8 bg-white shadow-md border-none"
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleExpand();
                        }}
                        aria-expanded={expanded}
                    >
                        {expanded ? (
                            <ChevronUp size={16} className="text-primary" />
                        ) : (
                            <ChevronDown size={16} className="text-primary" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ElectionHead;