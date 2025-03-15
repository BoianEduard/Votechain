import React from 'react';
import PropTypes from 'prop-types';

const SettingsStep = ({ formData, handleInputChange, nextStep, prevStep }) => {
  return (
    <div className="form-step">
      <h2>Election Settings</h2>
      
      <div className="form-group">
        <label htmlFor="eligibilityType">Voter Eligibility</label>
        <select
          id="eligibilityType"
          name="eligibilityType"
          value={formData.eligibilityType}
          onChange={handleInputChange}
        >
          <option value="all">All Registered Users</option>
          <option value="id">ID Verification Required</option>
          <option value="whitelist">Specific Whitelist</option>
        </select>
      </div>
      
      {formData.eligibilityType === 'whitelist' && (
        <div className="form-group">
          <label htmlFor="whitelist">Email Addresses (one per line)</label>
          <textarea
            id="whitelist"
            name="whitelist"
            value={formData.whitelist}
            onChange={handleInputChange}
            placeholder="Enter email addresses, one per line"
            rows="4"
          />
        </div>
      )}
      
      <div className="form-group">
        <label>Privacy Settings</label>
        <div className="checkbox-group">
          <input 
            type="checkbox" 
            id="realTimeResults" 
            name="realTimeResults"
            checked={formData.realTimeResults}
            onChange={handleInputChange}
          />
          <label htmlFor="realTimeResults">Show results in real-time</label>
        </div>
      </div>
      
      <div className="form-actions">
        <button type="button" className="btn-back" onClick={prevStep}>
          Back
        </button>
        <button type="button" className="btn-next" onClick={nextStep}>
          Next: Review
        </button>
      </div>
    </div>
  );
};

SettingsStep.propTypes = {
  formData: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  nextStep: PropTypes.func.isRequired,
  prevStep: PropTypes.func.isRequired
};

export default SettingsStep;