import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Shield } from 'lucide-react';

const VoteSuccessCard = ({ election, selectedCandidate }) => {
    return (
        <div className="card border-0 shadow-sm text-center p-6 rounded-xl">
            <div className="mb-6">
                <div
                    className="rounded-full mx-auto d-flex items-center justify-center mb-4"
                    style={{
                        width: "80px",
                        height: "80px",
                        background: "rgba(25, 135, 84, 0.1)"
                    }}
                >
                    <CheckCircle size={40} className="text-success" />
                </div>
                <h3 className="text-2xl font-bold">Vote Successfully Cast!</h3>
                <p className="text-muted mb-4">
                    Your vote for <strong>{selectedCandidate.name}</strong> has been recorded securely.
                </p>
            </div>

            <div className="card mb-6 border-0 bg-light p-6 rounded-lg">
                <div className="card-body">
                    <h5 className="font-bold text-lg mb-3">Receipt Information</h5>
                    <p className="mb-2">
                        <strong>Confirmation ID:</strong>{" "}
                        <span className="font-monospace">
                            {Math.random().toString(36).substring(2, 15).toUpperCase()}
                        </span>
                    </p>
                    <p className="mb-2">
                        <strong>Election:</strong> {election.title}
                    </p>
                    <p className="mb-2">
                        <strong>Date & Time:</strong>{" "}
                        {new Date().toLocaleString()}
                    </p>
                    <p className="text-sm text-muted mb-0">
                        <Shield size={14} className="mr-1" />
                        This receipt does not reveal your specific vote choice
                    </p>
                </div>
            </div>

            <div className="flex justify-center space-x-4">
                <Link
                    to="/vote"
                    className="btn btn-primary px-6 py-3 rounded-full"
                >
                    Return to Elections
                </Link>
                <button
                    className="btn btn-outline-secondary px-6 py-3 rounded-full"
                    onClick={() => window.print()}
                >
                    Print Receipt
                </button>
            </div>
        </div>
    );
};

export default VoteSuccessCard;