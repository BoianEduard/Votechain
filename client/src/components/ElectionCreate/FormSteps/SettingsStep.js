import React from 'react';
import PropTypes from 'prop-types';
import NavigationButton from "../../Commons/NavigationButton";
import FormContainer from "../../../hooks/ElectionCreateHook/useExpandableSection";
import InputSection from "../FormComponents/InputSection";
import FormInput from "../FormComponents/FormInput";

const SettingsStep = ({ formData, handleInputChange, nextStep, prevStep }) => {
    return (
        <FormContainer
            title="Election Settings"
            className="p-0"
        >
            <InputSection
                title="Eligibility Settings"
                className="mb-6"
            >
                <select
                    id="eligibilityType"
                    name="eligibilityType"
                    value={formData.eligibilityType}
                    onChange={handleInputChange}
                    className="w-full -mt-2 p-2 border border-gray-200 rounded-lg appearance-none bg-white"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23666666'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 1rem center',
                        backgroundSize: '1.5em 1.5em'
                    }}
                >
                    <option value="all">All Registered Users</option>
                    <option value="whitelist">Specific Email Addresses</option>
                    <option value="domain">Email Domain Whitelist</option>
                </select>
            </InputSection>

            {formData.eligibilityType === 'whitelist' && (
                <div className="mb-6">
                    <FormInput
                        type="textarea"
                        label="Email Addresses (one per line)"
                        id="whitelist"
                        name="whitelist"
                        value={formData.whitelist}
                        onChange={handleInputChange}
                        placeholder="Enter email addresses, one per line&#10;example@domain.com&#10;user@company.org"
                        rows={4}
                        className="p-3 border-gray-200"
                    />
                    <p className="text-sm text-gray-600 -mt-5">
                        Enter complete email addresses of users who can vote
                    </p>
                </div>
            )}

            {formData.eligibilityType === 'domain' && (
                <div className="mb-2 mt-0">
                    <FormInput
                        type="textarea"
                        label="Domain Names (one per line)"
                        id="domainWhitelist"
                        name="domainWhitelist"
                        value={formData.domainWhitelist || ''}
                        onChange={handleInputChange}
                        placeholder="Enter domain names, one per line&#10;@stud.ase.ro&#10;@company.com&#10;@organization.org"
                        rows={4}
                        className="p-3 border-gray-200"
                    />
                    <p className="text-sm text-gray-600 -mt-2">
                        Users with email addresses from these domains will be eligible to vote.
                        Include the @ symbol (e.g., @stud.ase.ro)
                    </p>
                </div>
            )}

            <InputSection
                title="Visibility Settings"
                className="mb-4"
            >
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="realTimeResults"
                        name="realTimeResults"
                        checked={formData.realTimeResults}
                        onChange={handleInputChange}
                        className="h-5 w-5 border-2 border-gray-300 rounded text-blue-600 focus:ring-0 focus:ring-offset-0"
                    />
                    <label htmlFor="realTimeResults" className="ml-3 text-lg -mt-2">
                        Show results in real-time
                    </label>
                </div>
            </InputSection>

            <div className="flex justify-between">
                <NavigationButton
                    title="Back: Add candidates"
                    direction="left"
                    onClick={prevStep}
                />

                <NavigationButton
                    title="Next: Review"
                    direction="right"
                    onClick={nextStep}
                />
            </div>
        </FormContainer>
    );
};

SettingsStep.propTypes = {
    formData: PropTypes.object.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    nextStep: PropTypes.func.isRequired,
    prevStep: PropTypes.func.isRequired
};

export default SettingsStep;