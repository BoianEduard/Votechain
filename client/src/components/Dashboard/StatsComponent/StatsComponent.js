import React from "react";
import StatCard from "./StatsCard";

const StatsSection = ({ stats }) => {
    return (
        <div className="row g-4 mb-5">
            {stats.map((stat, index) => (
                <div className="col-lg-4 col-md-4 col-sm-12" key={index}>
                    <StatCard stat={stat} />
                </div>
            ))}
        </div>
    );
};

export default StatsSection;
