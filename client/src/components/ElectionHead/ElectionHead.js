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
            className={`card-header py-3 ${expanded ? "border-bottom-0" : ""} bg-primary-light`}
            style={{
                cursor: "pointer",
                transition: "all 0.3s ease"
            }}
            onClick={toggleExpand}
        >
            <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center flex-grow-1">
                    <div
                        className="rounded-circle me-3 d-flex align-items-center justify-content-center"
                        style={{
                            width: "40px",
                            height: "40px",
                            background: "rgba(255,255,255,0.7)",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
                        }}
                    >
                    </div>
                    <div>
                        <h3 className="h5 mb-0 fw-bold">{election.title}</h3>
                        <div className="d-flex align-items-center text-muted small mt-1">
                            <Calendar className="me-1" size={12} />
                            <span>{formatDate(election.startDate)} - {formatDate(election.endDate)}</span>
                        </div>
                    </div>
                </div>
                <div className="d-flex align-items-center">
          <span
              className={`badge rounded-pill me-3 ${
                  daysRemaining > 0 ? "bg-success" : "bg-danger"
              }`}
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
                        className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                            width: "32px",
                            height: "32px",
                            background: "white",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                            border: "none"
                        }}
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