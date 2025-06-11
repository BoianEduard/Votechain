import React from 'react';

const AuthHead = ({ title, subtitle }) => {
    return (
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                <span className="text-purple-600">Arbi1</span>Vote
            </h1>
            <p className="text-gray-600">{subtitle}</p>
        </div>
    );
};

export default AuthHead;