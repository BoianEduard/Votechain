import React from 'react';
import PropTypes from 'prop-types';

const CandidateDetailsStep = ({
                                  formData,
                                  handleCandidateImageChange,
                                  handleCandidateChange,
                                  nextStep,
                                  prevStep
                              }) => {
    return (
        <div className="form-step">
            <h2>Candidate Details</h2>
            <p className="form-hint">Add an image and a short description for each candidate.</p>

            {formData.candidates.map((candidate, index) => (
                <div key={index} className="candidate-detail">
                    <h4>{candidate.name || `Candidate ${index + 1}`}</h4>

                    {/* Image Upload */}
                    <div className="form-group">
                        <label htmlFor={`candidate-image-${index}`}>Upload Image</label>
                        <input
                            type="file"
                            id={`candidate-image-${index}`}
                            accept="image/*"
                            onChange={(e) => handleCandidateImageChange(index, e.target.files[0])}
                        />
                        {candidate.imagePreview && (
                            <div className="image-preview">
                                <img src={candidate.imagePreview} alt="Preview" height="60" />
                                <button
                                    type="button"
                                    className="remove-image-btn"
                                    onClick={() => handleCandidateImageChange(index, null)}
                                >
                                    ✕
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div className="form-group">
                        <label htmlFor={`candidate-description-${index}`}>Description</label>
                        <textarea
                            id={`candidate-description-${index}`}
                            value={candidate.description || ''}
                            onChange={(e) => handleCandidateChange(index, 'description', e.target.value)}
                            placeholder="Enter a short description"
                            rows={3}
                        />
                    </div>

                    <hr />
                </div>
            ))}

            <div className="form-actions">
                <button type="button" className="btn btn-primary" onClick={prevStep}>
                    Back: Candidate Names <i className="bi bi-arrow-left ms-1"></i>
                </button>
                <button type="button" className="btn btn-primary" onClick={nextStep}>
                    Next: Eligibility Settings <i className="bi bi-arrow-right ms-1"></i>
                </button>
            </div>
        </div>
    );
};

CandidateDetailsStep.propTypes = {
    formData: PropTypes.object.isRequired,
    handleCandidateImageChange: PropTypes.func.isRequired,
    handleCandidateChange: PropTypes.func.isRequired,
    nextStep: PropTypes.func.isRequired,
    prevStep: PropTypes.func.isRequired
};

export default CandidateDetailsStep;
