import NavigationButton from "../../Commons/NavigationButton";
import FormInput from "../FormComponents/FormInput";
import PropTypes from "prop-types";

const BasicInfoStep = ({ formData, handleInputChange, nextStep }) => {
    return (
        <div className="form-step">
            <h2 className="mb-3 text-xl font-semibold">Basic Information</h2>

            <FormInput
                label="Election Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Board Member Election 2025"
                required
            />

            <FormInput
                label="Description"
                type="textarea"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Provide details about this election"
                rows={3}
                required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <FormInput
                    label="Start Date"
                    type="datetime-local"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                />

                <FormInput
                    label="End Date"
                    type="datetime-local"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                />
            </div>

            <div className="flex justify-end">
                <NavigationButton
                    title="Next: Add Candidates"
                    direction="right"
                    onClick={nextStep}
                />
            </div>
        </div>
    );
};

BasicInfoStep.propTypes = {
    formData: PropTypes.object.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    nextStep: PropTypes.func.isRequired
};

export default BasicInfoStep;