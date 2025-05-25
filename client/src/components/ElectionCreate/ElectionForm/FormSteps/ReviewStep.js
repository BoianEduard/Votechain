import React, { useState } from 'react';
import PropTypes from 'prop-types';
import NavigationButton from '../../../Commons/NavigationButton';
import LoadingSpinner from '../../../Commons/LoadingSpinner';
import ErrorMessage from '../../../Commons/Error';
import SuccessMessage from '../../../Commons/Success';

const ReviewStep = ({ formData, loading, error, successMessage, prevStep }) => {
    const [expandedSections, setExpandedSections] = useState({});

    const toggleSection = (section) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const truncateText = (text, maxLength = 100) => {
        if (!text) return 'Not specified';
        return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Not specified';
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const renderCandidate = (candidate, index) => (
        <div key={index} className="flex items-center space-x-3 bg-white rounded-md p-3">
            {candidate.imagePreview && (
                <img
                    src={candidate.imagePreview}
                    alt={`Candidate ${index + 1}`}
                    className="w-12 h-12 object-cover rounded-full flex-shrink-0"
                />
            )}
            <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                    {candidate.name || `Candidate ${index + 1}`}
                </p>
                {candidate.description && (
                    <p className="text-sm text-gray-600 truncate">
                        {truncateText(candidate.description, 80)}
                    </p>
                )}
            </div>
        </div>
    );

    return (
        <div className="flex-1 overflow-y-auto pr-2 space-y-4" style={{ maxHeight: 'calc(100vh - 350px)' }}>
        <div className="form-step flex flex-col max-h-fit">
            {/* Loading Overlay */}
            {loading && (
                <div className="absolute inset-0 bg-white bg-opacity-80 z-10 flex items-center justify-center rounded-lg">
                    <LoadingSpinner message="Creating election..." />
                </div>
            )}

            <div className="max-w-4xl mx-auto flex flex-col max-h-fit">
                <h2 className="text-2xl font-bold mb-6 text-center">Review Election Details</h2>

                {/* Success/Error Messages */}
                <div className="flex-shrink-0">
                    {successMessage && <SuccessMessage message={successMessage} />}
                    {error && <ErrorMessage error={error} />}
                </div>

                {/* Scrollable Section */}
                    {/* Basic Information */}
                    <section className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold mb-3">📋 Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div>
                                <p className="font-medium text-gray-700">Title:</p>
                                <p className="text-gray-900 mt-1">{truncateText(formData.title, 50)}</p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-700">Duration:</p>
                                <p className="text-gray-900 mt-1">
                                    {formatDate(formData.startDate)} → {formatDate(formData.endDate)}
                                </p>
                            </div>
                        </div>
                        {formData.description && (
                            <div className="mt-3">
                                <p className="font-medium text-gray-700">Description:</p>
                                <p className="text-gray-900 mt-1">
                                    {expandedSections.description
                                        ? formData.description
                                        : truncateText(formData.description, 120)}
                                    {formData.description.length > 120 && (
                                        <button
                                            onClick={() => toggleSection('description')}
                                            className="text-blue-600 hover:text-blue-800 ml-2 text-sm font-medium"
                                        >
                                            {expandedSections.description ? 'Show less' : 'Show more'}
                                        </button>
                                    )}
                                </p>
                            </div>
                        )}
                    </section>

                    {/* Candidates */}
                    <section className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-semibold">🗳️ Candidates ({formData.candidates.length})</h3>
                            {formData.candidates.length > 2 && (
                                <button
                                    onClick={() => toggleSection('candidates')}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                    {expandedSections.candidates ? 'Show less' : 'Show all'}
                                </button>
                            )}
                        </div>
                        <div className="space-y-3">
                            {(expandedSections.candidates
                                    ? formData.candidates
                                    : formData.candidates.slice(0, 2)
                            ).map(renderCandidate)}
                            {!expandedSections.candidates && formData.candidates.length > 2 && (
                                <p className="text-sm text-gray-500 text-center py-2">
                                    + {formData.candidates.length - 2} more candidates
                                </p>
                            )}
                        </div>
                    </section>

                    {/* Settings */}
                    <section className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold mb-3">⚙️ Settings</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full" />
                                <span className="font-medium">Eligibility:</span>
                                <span className="text-gray-700">
                                    {formData.eligibilityType === 'all' ? 'All Users' : 'Whitelist'}
                                </span>
                            </div>
                            {formData.eligibilityType === 'whitelist' && formData.whitelist && (
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                                    <span className="font-medium">Whitelisted:</span>
                                    <span className="text-gray-700">
                                        {
                                            formData.whitelist
                                                .split('\n')
                                                .filter(email => email.trim() !== '').length
                                        } emails
                                    </span>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <span
                                    className={`w-2 h-2 rounded-full ${
                                        formData.realTimeResults ? 'bg-green-500' : 'bg-gray-400'
                                    }`}
                                />
                                <span className="font-medium">Real-time Results:</span>
                                <span className="text-gray-700">
                                    {formData.realTimeResults ? 'Enabled' : 'Disabled'}
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* Blockchain Notice */}
                    <section className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                            <div className="text-2xl">🔒</div>
                            <div>
                                <p className="text-sm font-medium text-blue-900">Blockchain Secured</p>
                                <p className="text-xs text-blue-700">Transaction fees may apply upon creation</p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Action Buttons */}
                <div className="form-actions mt-4 flex justify-between items-center bg-white py-4 border-t">
                    <NavigationButton title="Back: Settings" direction="left" onClick={prevStep} />
                    <button
                        type="submit"
                        disabled={loading}
                        className={`flex items-center px-8 py-3 rounded-md font-medium transition-all duration-200 ${
                            loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg transform hover:-translate-y-0.5'
                        } text-white`}
                    >
                        {loading ? 'Creating...' : 'Create Election'}
                    </button>
                </div>
            </div>
        </div>
    );
};

ReviewStep.propTypes = {
    formData: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    successMessage: PropTypes.string,
    prevStep: PropTypes.func.isRequired,
};

export default ReviewStep;