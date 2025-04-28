import React from 'react';
import PropTypes from 'prop-types';

const SettingsStep = ({ formData, handleInputChange, nextStep, prevStep }) => {
    return (
        <div className="p-6">
            <h2 className="text-2xl font-medium mb-8">Election Settings</h2>

            <div className="mb-8">
                <h3 className="text-xl font-medium mb-4">Voter Eligibility</h3>
                <select
                    id="eligibilityType"
                    name="eligibilityType"
                    value={formData.eligibilityType}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-lg appearance-none bg-white"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23666666'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 1rem center',
                        backgroundSize: '1.5em 1.5em'
                    }}
                >
                    <option value="all">All Registered Users</option>
                    <option value="whitelist">Specific Whitelist</option>
                </select>
            </div>

            {formData.eligibilityType === 'whitelist' && (
                <div className="mb-8">
                    <label htmlFor="whitelist" className="block text-lg font-medium mb-2">Email Addresses (one per line)</label>
                    <textarea
                        id="whitelist"
                        name="whitelist"
                        value={formData.whitelist}
                        onChange={handleInputChange}
                        placeholder="Enter email addresses, one per line"
                        rows="4"
                        className="w-full p-3 border border-gray-200 rounded-lg"
                    />
                </div>
            )}

            <div className="mb-8">
                <h3 className="text-xl font-medium mb-4">Privacy Settings</h3>
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="realTimeResults"
                        name="realTimeResults"
                        checked={formData.realTimeResults}
                        onChange={handleInputChange}
                        className="h-5 w-5 border-2 border-gray-300 rounded text-blue-600 focus:ring-0 focus:ring-offset-0"
                    />
                    <label htmlFor="realTimeResults" className="ml-3 text-lg">
                        Show results in real-time
                    </label>
                </div>
            </div>

            <div className="flex justify-between mt-10">
                <button
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    onClick={prevStep}
                >
                    Back: Add candidates
                </button>
                <button
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    onClick={nextStep}
                >
                    Next: Review
                </button>
            </div>
        </div>
    );
};

SettingsStep.propTypes = {
    formData: PropTypes.object.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    nextStep: PropTypes.func.isRequired,
    prevStep: PropTypes.func.isRequired
};

export default SettingsStep;