import React from 'react';
import PropTypes from 'prop-types';

const BasicInfoStep = ({ formData, handleInputChange, nextStep }) => {
    return (
        <div className="form-step">
            <h2 className="mb-3">Basic Information</h2>

            <div className="mb-3">
                <label htmlFor="title" className="form-label mb-1">Election Title</label>
                <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Board Member Election 2025"
                    required
                />
            </div>

            <div className="mb-3">
                <label htmlFor="description" className="form-label mb-1">Description</label>
                <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Provide details about this election"
                    rows="3"
                    required
                />
            </div>

            <div className="row mb-4">
                <div className="col-md-6">
                    <label htmlFor="startDate" className="form-label mb-1">Start Date</label>
                    <input
                        type="datetime-local"
                        className="form-control"
                        id="startDate"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="col-md-6">
                    <label htmlFor="endDate" className="form-label mb-1">End Date</label>
                    <input
                        type="datetime-local"
                        className="form-control"
                        id="endDate"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        required
                    />
                </div>
            </div>

            <div className="d-flex justify-content-end sticky-bottom">
                <button className="btn btn-primary" onClick={nextStep}>
                    Next: Add Candidates <i className="bi bi-arrow-right ms-1"></i>
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