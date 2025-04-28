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
            <h2 className="text-2xl font-semibold mb-3">Candidates</h2>
            <p className="text-sm text-gray-600 mb-5">Add at least two candidates for your election.</p>

            {formData.candidates.map((candidate, index) => (
                <div key={index} className="flex items-center mb-4">
                    <div className="w-full mr-4">
                        <label htmlFor={`candidate-${index}`} className="block text-sm font-medium mb-1">Candidate {index + 1}</label>
                        <input
                            type="text"
                            id={`candidate-${index}`}
                            value={candidate.name || ''}
                            onChange={(e) => handleCandidateChange(index, 'name', e.target.value)}
                            placeholder="Candidate name"
                            required
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="button"
                        className="text-red-500 ml-2 hover:text-red-700"
                        onClick={() => removeCandidate(index)}
                        disabled={formData.candidates.length <= 2}
                    >
                        ✕
                    </button>
                </div>
            ))}

            <button
                type="button"
                className="px-4 py-2 mt-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={addCandidate}
            >
                + Add Another Candidate
            </button>

            <div className="flex justify-between mt-6">
                <button
                    type="button"
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    onClick={prevStep}
                >
                    Back: Basic Info <i className="bi bi-arrow-left ml-2"></i>
                </button>
                <button
                    type="button"
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    onClick={nextStep}
                >
                    Next: Candidate Details <i className="bi bi-arrow-right ml-2"></i>
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
    prevStep: PropTypes.func.isRequired
};

export default CandidatesStep;