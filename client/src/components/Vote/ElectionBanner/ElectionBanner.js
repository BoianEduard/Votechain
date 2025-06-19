import React from 'react';
import { Calendar, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ElectionBanner = ({ election, formatDate, daysRemaining }) => {
    return (
        <>
            <div className="bg-gradient-to-b from-indigo-700 to-indigo-500 pt-8 pb-12">
                <div className="max-w-4xl mx-auto px-4">
                    <Link
                        to="/vote"
                        className="inline-flex items-center mb-4 text-white hover:text-indigo-200 transition-colors"
                    >
                        <ArrowLeft size={16} className="mr-2" />
                        Back to Elections
                    </Link>

                    <h1 className="text-3xl font-bold text-white mb-2">{election.title}</h1>

                    <div className="flex items-center text-indigo-100 mb-2">
                        <Calendar className="mr-2" size={16} />
                        <span>
              {formatDate(election.startDate)} - {formatDate(election.endDate)}
            </span>
                        <span
                            className={`ml-3 inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800`}
                        >
              {daysRemaining > 0 ? `${daysRemaining} days left` : "Closed"}
            </span>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 -mt-8">
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                        <span className="block text-sm text-gray-500">Candidates</span>
                        <span className="font-bold text-gray-800 text-lg">
              {election.candidates.length}
            </span>
                    </div>

                    {daysRemaining > 0 && (
                        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                            <span className="block text-sm text-gray-500">Time Remaining</span>
                            <span className="font-bold text-gray-800 text-lg">
                {daysRemaining} days
              </span>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ElectionBanner;