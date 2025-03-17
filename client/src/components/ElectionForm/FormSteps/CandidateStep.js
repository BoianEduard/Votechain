import React from 'react';
import PropTypes from 'prop-types';

const CandidatesStep = ({ 
  formData, 
  handleCandidateChange, 
  addCandidate, 
  removeCandidate, 
  nextStep, 
  prevStep 
}) => {
  return (
    <div className="form-step">
      <h2>Candidates</h2>
      <p className="form-hint"> Add at least two candidates for your election </p>
      
      {formData.candidates.map((candidate, index) => (
        <div key={index} className="candidate-row">
          <div className="form-group candidate-input">
            <label htmlFor={`candidate-${index}`}>Candidate {index + 1}</label>
            <input
              type="text"
              id={`candidate-${index}`}
              value={candidate}
              onChange={(e) => handleCandidateChange(index, e.target.value)}
              placeholder="Candidate name"
              required
            />
          </div>
          <button 
            type="button" 
            className="btn-remove"
            onClick={() => removeCandidate(index)}
            disabled={formData.candidates.length <= 2}
          >
            ✕
          </button>
        </div>
      ))}
      
      <button type="button" className="btn-add" onClick={addCandidate}>
        + Add Another Candidate
      </button>
      
      <div className="form-actions">
        <button type="button" className="btn-back" onClick={prevStep}>
          Back
        </button>
        <button type="button" className="btn-next" onClick={nextStep}>
          Next: Settings
        </button>
      </div>
    </div>
  );
};

CandidatesStep.propTypes = {
  formData: PropTypes.object.isRequired,
  handleCandidateChange: PropTypes.func.isRequired,
  addCandidate: PropTypes.func.isRequired,
  removeCandidate: PropTypes.func.isRequired,
  nextStep: PropTypes.func.isRequired,
  prevStep: PropTypes.func.isRequired,
};

export default CandidatesStep;