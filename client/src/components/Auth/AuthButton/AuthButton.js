import React from 'react';

const AuthButton = ({
                        type = "button",
                        onClick,
                        disabled = false,
                        isLoading = false,
                        loadingText,
                        children
                    }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className="w-full bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 hover:brightness-110 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition duration-200 flex items-center justify-center disabled:opacity-50"
            disabled={disabled}
        >
            {isLoading ? (
                <>
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                    {loadingText}
                </>
            ) : children}
        </button>
    );
};

export default AuthButton;