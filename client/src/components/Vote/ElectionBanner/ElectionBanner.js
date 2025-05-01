import React from 'react';
import { Calendar, Users, Clock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ElectionBanner = ({ election, formatDate, daysRemaining }) => {
    return (
        <>
            <Link
                to="/vote"
                className="btn btn-outline-secondary inline-flex items-center mb-3 text-gray-600 border border-gray-300 rounded-full py-2 px-4 hover:bg-gray-100"
            >
                <ArrowLeft size={16} className="mr-2" />
                Back to Elections
            </Link>

            <div
                className="p-3 rounded-3xl mb-2"
                style={{
                    background: "linear-gradient(135deg, #f5f7ff 0%, #e9f0ff 100%)"
                }}
            >
                <div className="flex flex-col md:flex-row items-center md:items-start">
                    <div className="md:w-2/3">
                        <h1 className="text-3xl font-bold mb-2">{election.title}</h1>
                        <div className="flex items-center text-gray-500 mb-3">
                            <Calendar className="mr-2" size={16} />
                            <span>
                                {formatDate(election.startDate)} - {formatDate(election.endDate)}
                            </span>
                            <span
                                className={`ml-3 inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                    daysRemaining > 0 ? "bg-green-500 text-white" : "bg-red-500 text-white"
                                }`}
                            >
                                {daysRemaining > 0 ? `${daysRemaining} days left` : "Closed"}
                            </span>
                        </div>
                        <p className="mb-0 text-gray-700">{election.description}</p>
                    </div>
                    <div className="md:w-1/3 text-right mt-4 md:mt-0">
                        <div className="flex flex-col items-end">
                            <div className="flex items-center mb-2">
                                <Users className="mr-2 text-blue-600" size={16} />
                                <span className="font-medium text-gray-700">
                                    {election.candidates.length} Candidates
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