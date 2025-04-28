import React from 'react';
import PropTypes from 'prop-types';

const BasicInfoStep = ({ formData, handleInputChange, nextStep }) => {
    return (
        <div className="form-step">
            <h2 className="mb-3 text-xl font-semibold">Basic Information</h2>

            <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium mb-1">Election Title</label>
                <input
                    type="text"
                    className="w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Board Member Election 2025"
                    required
                />
            </div>

            <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
                <textarea
                    className="w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Provide details about this election"
                    rows="3"
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <label htmlFor="startDate" className="block text-sm font-medium mb-1">Start Date</label>
                    <input
                        type="datetime-local"
                        className="w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        id="startDate"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="endDate" className="block text-sm font-medium mb-1">End Date</label>
                    <input
                        type="datetime-local"
                        className="w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        id="endDate"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        required
                    />
                </div>
            </div>

            <div className="flex justify-end sticky-bottom">
                <button
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    onClick={nextStep}
                >
                    Next: Add Candidates <i className="bi bi-arrow-right ml-2"></i>
                </button>
            </div>
        </div>
    );
};

BasicInfoStep.propTypes = {
    formData: PropTypes.object.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    nextStep: PropTypes.func.isRequired
};

export default BasicInfoStep;