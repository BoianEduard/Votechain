import React from 'react';
import PropTypes from 'prop-types';
import NavigationButton from '../../Commons/NavigationButton';
import FormContainer from '../../../hooks/ElectionCreateHook/useExpandableSection';
import InputSection from '../FormComponents/InputSection';
import StatusIndicator from '../FormComponents/StatusIndicator';
import { useExpandableSection } from '../../../hooks/ElectionCreateHook/useExpandableSection';

const ReviewStep = ({ formData, prevStep, nextStep }) => {
    const { expandedSections, toggleSection, isExpanded } = useExpandableSection();

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

    const getEligibilityText = () => {
        switch (formData.eligibilityType) {
            case 'all':
                return 'All Users';
            case 'whitelist':
                return 'Email Whitelist';
            case 'domain':
                return 'Domain Whitelist';
            default:
                return 'Not specified';
        }
    };

    const getWhitelistCount = () => {
        if (formData.eligibilityType === 'whitelist' && formData.whitelist) {
            return formData.whitelist
                .split('\n')
                .filter(email => email.trim() !== '').length;
        }
        if (formData.eligibilityType === 'domain' && formData.domainWhitelist) {
            return formData.domainWhitelist
                .split('\n')
                .filter(domain => domain.trim() !== '').length;
        }
        return 0;
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
        <FormContainer
            title="Review Election Details"
            maxHeight="calc(100vh - 350px)"
            className="p-0"
        >
            <div className="space-y-4">
                <InputSection
                    title="Basic Information"
                    icon="📋"
                    expandable={formData.description && formData.description.length > 120}
                    expanded={isExpanded('description')}
                    onToggle={() => toggleSection('description')}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                            <p className="font-medium text-gray-700">Title:</p>
                            <p className="text-gray-900 mt-1">
                                {truncateText(formData.title, 50)}
                            </p>
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
                                {isExpanded('description')
                                    ? formData.description
                                    : truncateText(formData.description, 120)}
                            </p>
                        </div>
                    )}
                </InputSection>

                <InputSection
                    title={`Candidates (${formData.candidates.length})`}
                    icon="🗳️"
                    expandable={formData.candidates.length > 2}
                    expanded={isExpanded('candidates')}
                    onToggle={() => toggleSection('candidates')}
                >
                    <div className="space-y-3">
                        {(isExpanded('candidates')
                                ? formData.candidates
                                : formData.candidates.slice(0, 2)
                        ).map(renderCandidate)}
                        {!isExpanded('candidates') && formData.candidates.length > 2 && (
                            <p className="text-sm text-gray-500 text-center py-2">
                                + {formData.candidates.length - 2} more candidates
                            </p>
                        )}
                    </div>
                </InputSection>

                <InputSection title="Settings" icon="⚙️">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-3">
                            <span className="w-2 h-2 bg-blue-500 rounded-full" />
                            <span className="font-medium">Eligibility:</span>
                            <span className="text-gray-700">
                                {getEligibilityText()}
                            </span>
                        </div>

                        {(formData.eligibilityType === 'whitelist' || formData.eligibilityType === 'domain') &&
                            getWhitelistCount() > 0 && (
                                <div className="flex items-center gap-3">
                                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                                    <span className="font-medium">
                                    {formData.eligibilityType === 'whitelist' ? 'Emails:' : 'Domains:'}
                                </span>
                                    <span className="text-gray-700">
                                    {getWhitelistCount()} {formData.eligibilityType === 'whitelist' ? 'emails' : 'domains'}
                                </span>
                                </div>
                            )}

                        <StatusIndicator
                            status={formData.realTimeResults}
                            label="Real-time Results"
                        />
                    </div>
                </InputSection>

                <InputSection
                    title="Blockchain Secured"
                    icon="🔒"
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4"
                >
                    <p className="text-xs text-blue-700">
                        The cost for deploying an election is calculated
                        dynamically based on the number of participants.
                    </p>
                </InputSection>
            </div>

            <div className="flex justify-between mt-6 pt-4 border-t">
                <NavigationButton
                    title="Back: Settings"
                    direction="left"
                    onClick={prevStep}
                />
                <NavigationButton
                    title="Next: Payment"
                    direction="right"
                    onClick={nextStep}
                />
            </div>
        </FormContainer>
    );
};

ReviewStep.propTypes = {
    formData: PropTypes.object.isRequired,
    prevStep: PropTypes.func.isRequired,
    nextStep: PropTypes.func.isRequired,
};

export default ReviewStep;