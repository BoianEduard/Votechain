import PropTypes from "prop-types";

const StatusIndicator = ({
                             status,
                             label,
                             trueColor = "bg-green-500",
                             falseColor = "bg-gray-400"
                         }) => {
    return (
        <div className="flex items-center gap-3">
            <span className={`w-2 h-2 rounded-full ${status ? trueColor : falseColor}`} />
            <span className="font-medium">{label}:</span>
            <span className="text-gray-700">{status ? 'Enabled' : 'Disabled'}</span>
        </div>
    );
};

StatusIndicator.propTypes = {
    status: PropTypes.bool.isRequired,
    label: PropTypes.string.isRequired,
    trueColor: PropTypes.string,
    falseColor: PropTypes.string,
};

export default StatusIndicator;