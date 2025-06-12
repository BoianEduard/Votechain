import PropTypes from 'prop-types';
import React from 'react';

const InputSection = ({
                     title,
                     icon,
                     children,
                     expandable = false,
                     expanded = false,
                     onToggle,
                     className = "bg-gray-50 rounded-lg p-3"
                 }) => {
    return (
        <section className={className}>
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">
                    {icon && <span className="mr-2">{icon}</span>}
                    {title}
                </h3>
                {expandable && onToggle && (
                    <button
                        onClick={onToggle}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                        {expanded ? 'Show less' : 'Show more'}
                    </button>
                )}
            </div>
            {children}
        </section>
    );
};

InputSection.propTypes = {
    title: PropTypes.string.isRequired,
    icon: PropTypes.string,
    children: PropTypes.node.isRequired,
    expandable: PropTypes.bool,
    expanded: PropTypes.bool,
    onToggle: PropTypes.func,
    className: PropTypes.string,
};

export default InputSection;