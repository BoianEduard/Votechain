import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Shield } from 'lucide-react';

const VoteSuccessCard = ({ election, selectedCandidate }) => {
    return (
        <div className="card border-0 shadow-sm text-center p-5" style={{ borderRadius: "12px" }}>
            <div className="mb-4">
                <div
                    className="rounded-circle mx-auto d-flex align-items-center justify-content-center mb-3"
                    style={{
                        width: "80px",
                        height: "80px",
                        background: "rgba(25, 135, 84, 0.1)"
                    }}
                >
                    <CheckCircle size={40} className="text-success" />
                </div>
                <h3 className="h3 fw-bold">Vote Successfully Cast!</h3>
                <p className="text-muted mb-4">
                    Your vote for <strong>{selectedCandidate.name}</strong> has been recorded securely.
                </p>
            </div>

            <div className="card mb-4 border-0 bg-light p-3">
                <div className="card-body">
                    <h5 className="fw-bold mb-3">Receipt Information</h5>
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
                    <p className="small text-muted mb-0">
                        <Shield size={14} className="me-1" />
                        This receipt does not reveal your specific vote choice
                    </p>
                </div>
            </div>

            <div className="d-flex justify-content-center">
                <Link
                    to="/vote"
                    className="btn btn-primary px-4 py-2 me-3"
                    style={{
                        borderRadius: "50px"
                    }}
                >
                    Return to Elections
                </Link>
                <button
                    className="btn btn-outline-secondary px-4 py-2"
                    style={{
                        borderRadius: "50px"
                    }}
                    onClick={() => window.print()}
                >
                    Print Receipt
                </button>
            </div>
        </div>
    );
};

export default VoteSuccessCard;
