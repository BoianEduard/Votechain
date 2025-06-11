import React from 'react';

const AuthInput = ({
                       id,
                       type = "text",
                       label,
                       placeholder,
                       value,
                       onChange,
                       disabled = false,
                       required = false,
                       className = ""
                   }) => {
    return (
        <div className={className}>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            <input
                type={type}
                id={id}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
                required={required}
            />
        </div>
    );
};

export default AuthInput;