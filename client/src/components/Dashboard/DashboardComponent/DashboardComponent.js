import React from "react";
import DashboardHeader from "../DashboardHeader";
import StatSection from "../StatsComponent";
import ActionSection from "../ActionSection";
import InfoCard from "../../Commons/InfoCard";
import FooterCard from "../../Commons/FooterCard";

const Dashboard = ({ stats }) => {
    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            <DashboardHeader />

            <div className="container mx-auto py-6 px-4">
                <StatSection stats={stats} />
                <ActionSection />
                <InfoCard />
            </div>

            <FooterCard />
        </div>
    );
};

export default Dashboard;