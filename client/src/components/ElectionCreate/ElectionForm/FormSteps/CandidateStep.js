import React from 'react';
import PropTypes from 'prop-types';
import NavigationButton from "../../../Commons/NavigationButton";

const CandidatesStep = ({
                            formData,
                            handleCandidateChange,
                            addCandidate,
                            removeCandidate,
                            nextStep,
                            prevStep
                        }) => {
    return (
        <div className="form-step bg-white rounded-lg p-4 max-h-[70vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-1">Candidates</h2>
            <p className="text-sm text-gray-600 mb-4">Add at least two candidates for your election.</p>

            {formData.candidates.map((candidate, index) => (
                <div key={index} className="flex items-center mb-4">
                    <div className="w-full">
                        <label htmlFor={`candidate-${index}`} className="block text-sm font-medium mb-1">
                            Candidate {index + 1}
                        </label>
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
                        className="text-red-500 ml-3 mt-6 hover:text-red-700 disabled:opacity-30"
                        onClick={() => removeCandidate(index)}
                        disabled={formData.candidates.length <= 2}
                    >
                        ✕
                    </button>
                </div>
            ))}

            <div className="mt-3 mb-6">
                <button
                    type="button"
                    onClick={addCandidate}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                >
                    + Add Another Candidate
                </button>
            </div>

            <div className="flex justify-between">
                <NavigationButton
                    type="button"
                    title="Back: Basic Info"
                    direction="left"
                    onClick={prevStep}
                />
                <NavigationButton
                    type="button"
                    title="Next: Candidate Details"
                    direction="right"
                    onClick={nextStep}
                />
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