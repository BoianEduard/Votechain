import { useState } from 'react';
import PropTypes from 'prop-types';
import React from 'react';

export const useExpandableSection = (initialState = {}) => {
    const [expandedSections, setExpandedSections] = useState(initialState);

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const isExpanded = (section) => expandedSections[section] || false;

    return { expandedSections, toggleSection, isExpanded };
};

const FormContainer = ({
                           title,
                           children,
                           maxHeight = 'calc(100vh - 400px)',
                           className = "bg-white rounded-lg p-4"
                       }) => {
    return (
        <div className={`${className} overflow-y-auto`} style={{ maxHeight }}>
            {title && <h2 className="text-2xl font-semibold mb-4">{title}</h2>}
            {children}
        </div>
    );
};

FormContainer.propTypes = {
    title: PropTypes.string,
    children: PropTypes.node.isRequired,
    maxHeight: PropTypes.string,
    className: PropTypes.string,
};

export default FormContainer;