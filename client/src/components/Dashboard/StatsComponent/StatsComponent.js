import React from "react";
import StatCard from "./StatsCard";

const StatsSection = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
            {stats.map((stat, index) => (
                <div className="col" key={index}>
                    <StatCard stat={stat} />
                </div>
            ))}
        </div>
    );
};

export default StatsSection;