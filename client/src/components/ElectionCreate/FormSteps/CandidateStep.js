import React from 'react';
import PropTypes from 'prop-types';
import NavigationButton from "../../Commons/NavigationButton";
import FormContainer from "../../../hooks/ElectionCreateHook/useExpandableSection";
import FormInput from "../FormComponents/FormInput";

const CandidatesStep = ({
                            formData,
                            handleCandidateChange,
                            addCandidate,
                            removeCandidate,
                            nextStep,
                            prevStep
                        }) => {
    return (
        <FormContainer
            title="Candidates"
            className="form-step bg-white rounded-lg p-0"
            maxHeight="70vh"
        >
            <p className="text-sm text-gray-600 mb-2">Add at least two candidates for your election.</p>

            {formData.candidates.map((candidate, index) => (
                <div key={index} className="flex items-center mb-2">
                    <div className="w-full">
                        <FormInput
                            label={`Candidate ${index + 1}`}
                            value={candidate.name || ''}
                            onChange={(e) => handleCandidateChange(index, 'name', e.target.value)}
                            placeholder="Candidate name"
                            name={`candidate-${index}`}
                            id={`candidate-${index}`}
                            required
                            className="border-gray-300"
                        />
                    </div>

                    <button
                        type="button"
                        className="text-red-500 ml-3 mt-4 hover:text-red-700 disabled:opacity-30"
                        onClick={() => removeCandidate(index)}
                        disabled={formData.candidates.length <= 2}
                    >
                        ✕
                    </button>
                </div>
            ))}

            <div className="mt-3 mb-4">
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
        </FormContainer>
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