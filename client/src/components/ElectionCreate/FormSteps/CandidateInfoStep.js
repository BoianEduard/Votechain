import React from 'react';
import PropTypes from 'prop-types';
import NavigationButton from "../../Commons/NavigationButton";
import FormContainer from "../../../hooks/ElectionCreateHook/useExpandableSection";

const CandidateDetailsStep = ({
                                  formData,
                                  handleCandidateImageChange,
                                  handleCandidateChange,
                                  nextStep,
                                  prevStep
                              }) => {
    return (
        <FormContainer
            title="Candidate Details"
            className="bg-white rounded-lg p-0"
            maxHeight="calc(100vh - 200px)"
        >
            {formData.candidates.map((candidate, index) => (
                <div key={index} className="mb-4 p-3 bg-gray-50 rounded-md border border-gray-200">
                    <div className="flex items-center mb-2">
            <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2">
              {index + 1}
            </span>
                        <h4 className="font-medium">{candidate.name || `Candidate ${index + 1}`}</h4>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <div className="flex items-center">
                            {candidate.imagePreview ? (
                                <img
                                    src={candidate.imagePreview}
                                    alt="Preview"
                                    className="w-16 h-16 object-cover rounded-md mr-2"
                                />
                            ) : (
                                <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center mr-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}

                            <div>
                                <label
                                    htmlFor={`candidate-image-${index}`}
                                    className="cursor-pointer text-sm text-blue-600 hover:text-blue-800 block"
                                >
                                    Upload Image
                                </label>
                                <input
                                    type="file"
                                    id={`candidate-image-${index}`}
                                    accept="image/*"
                                    onChange={(e) => handleCandidateImageChange(index, e.target.files[0])}
                                    className="hidden"
                                />

                                {candidate.imagePreview && (
                                    <button
                                        type="button"
                                        className="text-xs text-red-500 hover:text-red-700"
                                        onClick={() => handleCandidateImageChange(index, null)}
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 min-w-[200px]">
              <textarea
                  value={candidate.description || ''}
                  onChange={(e) => handleCandidateChange(index, 'description', e.target.value)}
                  placeholder="Enter a short description"
                  rows={2}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
                        </div>
                    </div>
                </div>
            ))}

            <div className="flex justify-between mt-4">
                <NavigationButton
                    title="Back: Complete candidates info"
                    direction="left"
                    onClick={prevStep}
                />
                <NavigationButton
                    title="Next: Settings"
                    direction="right"
                    onClick={nextStep}
                />
            </div>
        </FormContainer>
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