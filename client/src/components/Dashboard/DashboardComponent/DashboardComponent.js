import React from "react";
import DashboardHeader from "../DashboardHeader";
import StatSection from "../StatsComponent";
import ActionSection from "../ActionSection";
import InfoCard from "../../Commons/InfoCard";
import FooterCard from "../../Commons/FooterCard";
import ElectionPageHeader from "../../Commons/ElectionPageHeader"; // adjust path

const Dashboard = ({ stats }) => {
    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            <div className="py-8 mb-6 bg-gradient-to-r from-indigo-800 to-indigo-600 shadow-lg">
                <div className="container mx-auto px-4">
                    <ElectionPageHeader
                        title="Votechain Dashboard"
                        description="Secure, transparent, and decentralized voting platform"
                        backLink="/logout"
                        backLabel="Logout"
                    />
                </div>
            </div>

            <div className="container mx-auto py-6 px-4 flex-grow">
                <StatSection stats={stats} />
                <ActionSection />
                <InfoCard />
            </div>

            <FooterCard />
        </div>
    );
};


export default Dashboard;