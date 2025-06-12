import React from 'react';
import PropTypes from 'prop-types';

const FormInput = ({
                       label,
                       type = 'text',
                       placeholder,
                       value,
                       onChange,
                       name,
                       id,
                       required = false,
                       rows = 3,
                       className = '',
                       ...props
                   }) => {
    const baseClasses = "w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
    const inputClasses = `${baseClasses} ${className}`;

    return (
        <div className="mb-4">
            {label && (
                <label htmlFor={id || name} className="block text-sm font-medium mb-1">
                    {label}
                </label>
            )}
            {type === 'textarea' ? (
                <textarea
                    className={inputClasses}
                    id={id || name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    rows={rows}
                    required={required}
                    {...props}
                />
            ) : (
                <input
                    type={type}
                    className={inputClasses}
                    id={id || name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    {...props}
                />
            )}
        </div>
    );
};

FormInput.propTypes = {
    label: PropTypes.string,
    type: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string,
    id: PropTypes.string,
    required: PropTypes.bool,
    rows: PropTypes.number,
    className: PropTypes.string,
};

export default FormInput;