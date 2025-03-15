import React from 'react';
import PropTypes from 'prop-types';
import ProgressTracker from './FormSteps/ProgressTracker';
import BasicInfoStep from './FormSteps/BasicInfoStep';
import CandidatesStep from './FormSteps/CandidateStep';
import SettingsStep from './FormSteps/SettingsStep';
import ReviewStep from './FormSteps/ReviewStep';
import './ElectionForm.css';

const ElectionForm = ({
  formData,
  handleInputChange,
  handleCandidateChange,
  addCandidate,
  removeCandidate,
  handleSubmit,
  loading,
  error,
  step,
  nextStep,
  prevStep
}) => {
  return (
    <div className="election-form-container">
      <ProgressTracker currentStep={step} />
      
      <div className="form-card">
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <BasicInfoStep 
              formData={formData} 
              handleInputChange={handleInputChange} 
              nextStep={nextStep} 
            />
          )}
          
          {step === 2 && (
            <CandidatesStep 
              formData={formData} 
              handleCandidateChange={handleCandidateChange}
              addCandidate={addCandidate}
              removeCandidate={removeCandidate}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}
          
          {step === 3 && (
            <SettingsStep 
              formData={formData} 
              handleInputChange={handleInputChange} 
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}
          
          {step === 4 && (
            <ReviewStep 
              formData={formData}
              loading={loading}
              error={error}
              prevStep={prevStep}
            />
          )}
        </form>
      </div>
    </div>
  );
};

ElectionForm.propTypes = {
  formData: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleCandidateChange: PropTypes.func.isRequired,
  addCandidate: PropTypes.func.isRequired,
  removeCandidate: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  step: PropTypes.number.isRequired,
  nextStep: PropTypes.func.isRequired,
  prevStep: PropTypes.func.isRequired
};

export default ElectionForm;