import React from 'react';

const AuthHead = ({ title, subtitle }) => {
    return (
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
            <span className="bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 text-transparent bg-clip-text">
                Arbi1
            </span>
                Vote
            </h1>
            <p className="text-gray-600">{subtitle}</p>
        </div>
    );
};

export default AuthHead;