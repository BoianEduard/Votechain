import React from 'react';

const AuthContainer = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
                {children}
            </div>
        </div>
    );
};

export default AuthContainer;