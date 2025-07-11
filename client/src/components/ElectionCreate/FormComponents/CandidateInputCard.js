import React from 'react';
import PropTypes from 'prop-types';
import FormInput from './FormInput';

const CandidateInputCard = ({
                           candidate,
                           index,
                           onImageChange,
                           onFieldChange,
                           onRemove,
                           showRemove = true,
                           canRemove = true,
                           showImage = false,
                           showDescription = false
                       }) => {
    return (
        <div className="mb-4 p-3 bg-gray-50 rounded-md border border-gray-200">
            <div className="flex items-center mb-2">
        <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2">
          {index + 1}
        </span>
                <h4 className="font-medium">{candidate.name || `Candidate ${index + 1}`}</h4>
                {showRemove && (
                    <button
                        type="button"
                        className="text-red-500 ml-auto hover:text-red-700 disabled:opacity-30"
                        onClick={() => onRemove(index)}
                        disabled={!canRemove}
                    >
                        ✕
                    </button>
                )}
            </div>

            <div className="space-y-3">
                {showImage && onImageChange && (
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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
                                onChange={(e) => onImageChange(index, e.target.files[0])}
                                className="hidden"
                            />

                            {candidate.imagePreview && (
                                <button
                                    type="button"
                                    className="text-xs text-red-500 hover:text-red-700"
                                    onClick={() => onImageChange(index, null)}
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {showDescription && (
                    <FormInput
                        type="textarea"
                        value={candidate.description || ''}
                        onChange={(e) => onFieldChange(index, 'description', e.target.value)}
                        placeholder="Enter a short description"
                        rows={2}
                        className="text-sm"
                    />
                )}
            </div>
        </div>
    );
};

CandidateInputCard.propTypes = {
    candidate: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    onImageChange: PropTypes.func,
    onFieldChange: PropTypes.func.isRequired,
    onRemove: PropTypes.func,
    showRemove: PropTypes.bool,
    canRemove: PropTypes.bool,
    showImage: PropTypes.bool,
    showDescription: PropTypes.bool,
};

export default CandidateInputCard;