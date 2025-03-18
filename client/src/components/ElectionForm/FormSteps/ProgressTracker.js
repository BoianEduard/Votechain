import React from 'react';
import PropTypes from 'prop-types';

const ProgressTracker = ({ currentStep }) => {
  return (
    <div className="progress-tracker">
      <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>
        <div className="step-number">1</div>
        <p>Basic Info</p>
      </div>
      <div className="progress-line"></div>
      <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>
        <div className="step-number">2</div>
        <p>Add Candidates</p>
      </div>
      <div className="progress-line"></div>
      <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}>
        <div className="step-number">3</div>
        <p>Settings</p>
      </div>
      <div className="progress-line"></div>
      <div className={`progress-step ${currentStep >= 4 ? 'active' : ''}`}>
        <div className="step-number">4</div>
        <p>Review</p>
      </div>
    </div>
  );
};

ProgressTracker.propTypes = {
  currentStep: PropTypes.number.isRequired
};

export default ProgressTracker;