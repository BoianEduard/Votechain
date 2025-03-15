import React from 'react';
import PropTypes from 'prop-types';

const BasicInfoStep = ({ formData, handleInputChange, nextStep }) => {
  return (
    <div className="form-step">
      <h2>Basic Information</h2>
      <div className="form-group">
        <label htmlFor="title">Election Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="e.g., Board Member Election 2025"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Provide details about this election"
          rows="4"
          required
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="startDate">Start Date</label>
          <input
            type="datetime-local"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="endDate">End Date</label>
          <input
            type="datetime-local"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>
      <div className="form-actions">
        <button type="button" className="btn-next" onClick={nextStep}>
          Next: Add Candidates
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