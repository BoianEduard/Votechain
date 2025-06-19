import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const ActionCard = ({ option }) => {
    const navigate = useNavigate();

    return (
        <div
            className="bg-white border-0 rounded-xl shadow-md transition-transform duration-200 ease-in-out cursor-pointer"
            onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.1)";
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 0.5rem 1rem rgba(0, 0, 0, 0.15)";
            }}
            onClick={() => navigate(option.path)}
        >
            <div className="p-4">
                <div
                    className="rounded-full mb-3 flex items-center justify-center"
                    style={{
                        backgroundColor: option.bgColor,
                        width: "64px",
                        height: "64px",
                        color: option.color
                    }}
                >
                    {option.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-2">{option.title}</h3>
                <p className="text-gray-500 mb-4">{option.description}</p>
                <div className="grid">
                    <button
                        className="bg-blue-600 text-white py-2 px-6 rounded-full text-sm font-medium flex items-center justify-center"
                        style={{
                            backgroundColor: option.color,
                        }}
                    >
                        Get Started <ChevronRight size={16} className="ml-1" />
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