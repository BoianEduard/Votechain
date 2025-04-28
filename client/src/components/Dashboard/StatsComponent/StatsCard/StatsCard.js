import React from "react";
import PropTypes from "prop-types";

const StatCard = ({ stat }) => {
    const rgbaColor = `rgba(${stat.color.replace('#', '').match(/.{2}/g).map(x => parseInt(x, 16)).join(',')}, 0.15)`;

    return (
        <div className="h-full rounded-lg shadow-lg border-0">
            <div className="p-4">
                <div className="flex items-center">
                    <div
                        className="rounded-full mr-3 flex items-center justify-center"
                        style={{
                            background: rgbaColor,
                            width: "60px",
                            height: "60px"
                        }}
                    >
                        <span className="text-center" style={{ color: stat.color }}>
                            {stat.icon}
                        </span>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold mb-0">{stat.value}</h2>
                        <p className="text-gray-500 mb-0">{stat.label}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

StatCard.propTypes = {
    stat: PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        icon: PropTypes.node.isRequired,
        color: PropTypes.string.isRequired
    }).isRequired
};

export default StatCard;