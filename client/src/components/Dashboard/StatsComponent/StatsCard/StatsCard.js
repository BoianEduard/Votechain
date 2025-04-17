import React from "react";
import PropTypes from "prop-types";

const StatCard = ({ stat }) => {
    return (
        <div className="card border-0 h-100 shadow" style={{ borderRadius: "16px" }}>
            <div className="card-body p-4">
                <div className="d-flex align-items-center">
                    <div
                        className="rounded-circle me-3 d-flex align-items-center justify-content-center"
                        style={{
                            background: `rgba(${stat.color.replace('#', '').match(/.{2}/g).map(x => parseInt(x, 16)).join(',')}, 0.15)`,
                            width: "60px",
                            height: "60px"
                        }}
                    >
                        <span style={{ color: stat.color }}>
                            {stat.icon}
                        </span>
                    </div>
                    <div>
                        <h2 className="display-6 fw-bold mb-0">{stat.value}</h2>
                        <p className="text-muted mb-0">{stat.label}</p>
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
