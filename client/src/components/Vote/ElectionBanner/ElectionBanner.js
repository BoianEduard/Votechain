import React from 'react';
import { Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import {Users, Clock} from "lucide-react";
import { ArrowLeft } from 'lucide-react';

const ElectionBanner = ({ election, formatDate, daysRemaining }) => {
    return (
        <>
            <Link
                to="/vote"
                className="btn btn-outline-secondary d-inline-flex align-items-center mb-3"
            >
                <ArrowLeft size={16} className="me-2" />
                Back to Elections
            </Link>

            <div
                className="p-4 rounded-4 mb-4"
                style={{
                    background: "linear-gradient(135deg, #f5f7ff 0%, #e9f0ff 100%)"
                }}
            >
                <div className="row align-items-center">
                    <div className="col-md-8">
                        <h1 className="h2 fw-bold mb-2">{election.title}</h1>
                        <div className="d-flex align-items-center text-muted mb-3">
                            <Calendar className="me-2" size={16} />
                            <span>
                                {formatDate(election.startDate)} - {formatDate(election.endDate)}
                            </span>
                            <span
                                className={`badge ms-3 ${
                                    daysRemaining > 0 ? "bg-success" : "bg-danger"
                                }`}
                            >
                                {daysRemaining > 0 ? `${daysRemaining} days left` : "Closed"}
                            </span>
                        </div>
                        <p className="mb-0">{election.description}</p>
                    </div>
                    <div className="col-md-4 text-md-end mt-3 mt-md-0">
                        <div className="d-flex flex-column align-items-md-end">
                            <div className="d-flex align-items-center mb-2">
                                <Users className="me-2 text-primary" size={16} />
                                <span className="fw-medium">
                                    {election.candidates.length} Candidates
                                </span>
                            </div>
                            <div className="d-flex align-items-center">
                                <Clock className="me-2 text-primary" size={16} />
                                <span className="fw-medium">
                                    Voting Method: {election.votingMethod}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ElectionBanner;
