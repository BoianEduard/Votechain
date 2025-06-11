import React from 'react';
import { Link } from 'react-router-dom';

const AuthFooter = ({ text, linkText, linkTo }) => {
    return (
        <div className="mt-8 text-center">
            <p className="text-gray-600">
                {text}{' '}
                <Link
                    to={linkTo}
                    className="text-purple-600 hover:text-purple-500 font-semibold hover:underline transition-colors duration-200"
                >
                    {linkText}
                </Link>
            </p>
        </div>
    );
};

export default AuthFooter;