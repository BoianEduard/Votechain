import React from 'react';
import PropTypes from 'prop-types';

const ReviewStep = ({ formData, loading, error, prevStep }) => {
  return (
    <div className="form-step">
      <h2> Review Election Details </h2>
      
      <div className="review-section">
        <h3> Basic Information </h3>
        <div className="review-item">
          <strong>Title: </strong> {formData.title || 'Not specified'}
        </div>
        <div className="review-item">
          <strong>Description:</strong> {formData.description || 'Not specified'}
        </div>
        <div className="review-item">
          <strong>Duration:</strong> {
            formData.startDate ? new Date(formData.startDate).toLocaleString() : 'Not specified'
          } to {
            formData.endDate ? new Date(formData.endDate).toLocaleString() : 'Not specified'
          }
        </div>
      </div>
      
      <div className="review-section">
        <h3>Candidates</h3>
        <ul className="candidate-list">
          {formData.candidates.map((candidate, index) => (
            <li key={index}>{candidate || `Candidate ${index + 1} (unnamed)`}</li>
          ))}
        </ul>
      </div>
      
      <div className="review-section">
        <h3>Settings</h3>
        <div className="review-item">
          <strong>Eligibility:</strong> {
            formData.eligibilityType === 'all' ? 'All Registered Users' :
            'Specific Whitelist'
          }
        </div>
        {formData.eligibilityType === 'whitelist' && formData.whitelist && (
          <div className="review-item">
            <strong>Whitelisted Emails:</strong> {
              formData.whitelist.split('\n').filter(email => email.trim() !== '').length
            }
          </div>
        )}
        <div className="review-item">
          <strong>Real-time Results:</strong> {formData.realTimeResults ? 'Yes' : 'No'}
        </div>
      </div>
      
      <div className="blockchain-notice">
        <div className="notice-icon">🔒</div>
        <p>This election will be secured on the blockchain once created. Transaction fees may apply.</p>
      </div>
      
      <div className="form-actions">
        <button type="button" className="btn-back" onClick={prevStep}>
          Back
        </button>
        <button 
          type="submit" 
          className="btn-create"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Election'}
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

ReviewStep.propTypes = {
  formData: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  prevStep: PropTypes.func.isRequired
};

export default ReviewStep;