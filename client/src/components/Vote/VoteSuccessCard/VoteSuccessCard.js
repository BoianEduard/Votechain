import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Shield, Printer, Home } from 'lucide-react';

const VoteSuccessCard = ({ election, selectedCandidate }) => {
    return (
        <div className="bg-white shadow-sm rounded-xl p-5 text-center">
            <div className="mb-5">
                <div
                    className="rounded-full mx-auto flex items-center justify-center mb-3"
                    style={{
                        width: "64px",
                        height: "64px",
                        background: "rgba(34, 197, 94, 0.1)"
                    }}
                >
                    <CheckCircle size={32} className="text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">Vote Successfully Cast!</h3>
                <p className="text-gray-600 text-sm mb-0">
                    Your vote for <strong>{selectedCandidate.name}</strong> has been recorded securely.
                </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-5 text-left">
                <h5 className="font-medium text-gray-700 text-sm mb-3">Receipt Information</h5>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Confirmation ID:</span>
                        <span className="font-mono text-gray-800">
                            {Math.random().toString(36).substring(2, 10).toUpperCase()}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Election:</span>
                        <span className="text-gray-800">{election.title}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Date & Time:</span>
                        <span className="text-gray-800">{new Date().toLocaleString()}</span>
                    </div>
                </div>
                <div className="flex items-center mt-3 text-gray-500 text-xs border-t border-gray-200 pt-2">
                    <Shield size={12} className="mr-1" />
                    <span>This receipt does not reveal your specific vote choice</span>
                </div>
            </div>

            <div className="flex justify-center space-x-3">
                <Link
                    to="/vote"
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition"
                >
                    <Home size={14} className="mr-1.5" />
                    Return to Elections
                </Link>
                <button
                    className="flex items-center px-4 py-2 border border-gray-300 text-gray-600 rounded-full text-sm hover:bg-gray-50 transition"
                    onClick={() => window.print()}
                >
                    <Printer size={14} className="mr-1.5" />
                    Print Receipt
                </button>
            </div>
        </div>
    );
};

export default VoteSuccessCard;