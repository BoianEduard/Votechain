import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const ActionCard = ({ option }) => {
    const navigate = useNavigate();

    return (
        <div
            className="card border-0 h-100 shadow"
            style={{
                borderRadius: "16px",
                cursor: "pointer",
                transition: "transform 0.2s ease, box-shadow 0.2s ease"
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.1)";
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 0.5rem 1rem rgba(0,0,0,0.15)";
            }}
            onClick={() => navigate(option.path)}
        >
            <div className="card-body p-4">
                <div
                    className="rounded-circle mb-3 d-flex align-items-center justify-content-center"
                    style={{
                        background: option.bgColor,
                        width: "64px",
                        height: "64px",
                        color: option.color
                    }}
                >
                    {option.icon}
                </div>
                <h3 className="h4 fw-bold mb-2">{option.title}</h3>
                <p className="text-muted mb-4">{option.description}</p>
                <div className="d-grid">
                    <button
                        className="btn btn-sm rounded-pill"
                        style={{
                            backgroundColor: option.color,
                            color: "white",
                            padding: "0.5rem 1.5rem",
                            fontWeight: "500"
                        }}
                    >
                        Get Started <ChevronRight size={16} className="ms-1" />
                    </button>
                </div>
            </div>
        </div>
    );
};

ActionCard.propTypes = {
    option: PropTypes.shape({
        title: PropTypes.string.isRequired,
        path: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        icon: PropTypes.node.isRequired,
        color: PropTypes.string.isRequired,
        bgColor: PropTypes.string.isRequired
    }).isRequired
};

export default ActionCard;
