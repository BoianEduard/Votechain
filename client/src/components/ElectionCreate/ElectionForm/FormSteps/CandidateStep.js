import React from 'react';
import PropTypes from 'prop-types';

const CandidatesStep = ({
                            formData,
                            handleCandidateChange,
                            handleCandidateImageChange,
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
                            value={candidate.name || ''}
                            onChange={(e) => {
                                if (typeof candidate === 'object') {
                                    handleCandidateChange(index, 'name', e.target.value);
                                } else {
                                    handleCandidateChange(index, e.target.value);
                                }
                            }}
                            placeholder="Candidate name"
                            required
                        />

                        {handleCandidateImageChange && (
                            <div className="candidate-image-upload">
                                <input
                                    type="file"
                                    id={`candidate-image-${index}`}
                                    accept="image/*"
                                    onChange={(e) => handleCandidateImageChange(index, e.target.files[0])}
                                    style={{ display: 'none' }}
                                />
                                <label htmlFor={`candidate-image-${index}`} className="image-upload-btn">
                                    {candidate.imagePreview ? 'Change Photo' : 'Add Photo'}
                                </label>
                                {candidate.imagePreview && (
                                    <div className="image-preview">
                                        <img src={candidate.imagePreview} alt="Preview" height="40" />
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
                        )}
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
                <button type="button" className="btn btn-primary" onClick={prevStep}>
                    Back: Basic Info <i className="bi bi-arrow-left ms-1"></i>
                </button>
                <button type="button" className="btn btn-primary" onClick={nextStep}>
                    Next: Eligibility Settings <i className="bi bi-arrow-right ms-1"></i>
                </button>
            </div>
        </div>
    );
};

CandidatesStep.propTypes = {
    formData: PropTypes.object.isRequired,
    handleCandidateChange: PropTypes.func.isRequired,
    handleCandidateImageChange: PropTypes.func,
    addCandidate: PropTypes.func.isRequired,
    removeCandidate: PropTypes.func.isRequired,
    nextStep: PropTypes.func.isRequired,
    prevStep: PropTypes.func.isRequired,
};

export default CandidatesStep;