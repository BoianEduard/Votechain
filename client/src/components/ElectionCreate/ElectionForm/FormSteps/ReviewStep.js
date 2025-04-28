import React from 'react';
import PropTypes from 'prop-types';

const ReviewStep = ({ formData, loading, error, prevStep }) => {
    return (
        <div className="form-step">
            <h2 className="text-2xl font-bold mb-4">Review Election Details</h2>

            <div className="review-section mb-6">
                <h3 className="text-xl font-semibold">Basic Information</h3>
                <div className="review-item mb-2">
                    <strong>Title: </strong> {formData.title || 'Not specified'}
                </div>
                <div className="review-item mb-2">
                    <strong>Description:</strong> {formData.description || 'Not specified'}
                </div>
                <div className="review-item mb-2">
                    <strong>Duration:</strong> {
                    formData.startDate ? new Date(formData.startDate).toLocaleString() : 'Not specified'
                } to {
                    formData.endDate ? new Date(formData.endDate).toLocaleString() : 'Not specified'
                }
                </div>
            </div>

            <div className="review-section mb-6">
                <h3 className="text-xl font-semibold">Candidates</h3>
                <ul className="candidate-list list-disc pl-5">
                    {formData.candidates.map((candidate, index) => (
                        <li key={index} className="mb-4">
                            <p className="font-medium">{candidate.name || `Candidate ${index + 1} (unnamed)`}</p>
                            {candidate.imagePreview && (
                                <img
                                    src={candidate.imagePreview}
                                    alt={`Preview for ${candidate.name}`}
                                    className="w-24 h-24 object-cover rounded-md mt-2"
                                />
                            )}
                            <p className="text-sm text-gray-500 mt-2">{candidate.description || "No description provided"}</p>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="review-section mb-6">
                <h3 className="text-xl font-semibold">Settings</h3>
                <div className="review-item mb-2">
                    <strong>Eligibility:</strong> {
                    formData.eligibilityType === 'all' ? 'All Registered Users' : 'Specific Whitelist'
                }
                </div>
                {formData.eligibilityType === 'whitelist' && formData.whitelist && (
                    <div className="review-item mb-2">
                        <strong>Whitelisted Emails:</strong> {
                        formData.whitelist.split('\n').filter(email => email.trim() !== '').length
                    }
                    </div>
                )}
                <div className="review-item mb-2">
                    <strong>Real-time Results:</strong> {formData.realTimeResults ? 'Yes' : 'No'}
                </div>
            </div>

            <div className="blockchain-notice bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 mt-6">
                <div className="text-xl font-semibold text-blue-500">🔒</div>
                <p>This election will be secured on the blockchain once created. Transaction fees may apply.</p>
            </div>

            <div className="form-actions mt-6 flex justify-between items-center">
                <button
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    onClick={prevStep}>
                    Back: Eligibility Settings
                </button>
                <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    disabled={loading}
                >
                    {loading ? 'Creating...' : 'Create Election'}
                </button>
            </div>

            {error && <div className="error-message text-red-500 mt-4">{error}</div>}
        </div>
    );
};

ReviewStep.propTypes = {
    formData: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    prevStep: PropTypes.func.isRequired
};

export default ReviewStep;