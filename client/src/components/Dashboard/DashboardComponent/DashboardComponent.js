import React from "react";
import DashboardHeader from "../DashboardHeader";
import StatSection from "../StatsComponent";
import ActionSection from "../ActionSection";
import InfoCard from "../../Commons/InfoCard";
import FooterCard from "../../Commons/FooterCard";

const Dashboard = ( {stats} ) => {
    return (
        <div className="bg-light min-vh-100 d-flex flex-column">
            <DashboardHeader />

            <div className="container pb-5">
                <StatSection stats = {stats} />
                <ActionSection />
                <InfoCard />
            </div>

            <FooterCard />
        </div>
    );
};

export default Dashboard;