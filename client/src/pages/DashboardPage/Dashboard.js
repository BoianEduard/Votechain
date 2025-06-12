import React from "react";
import LoadingSpinner from "../../components/Commons/LoadingSpinner";
import ErrorCard from "../../components/Commons/Error";
import { useDashboardStats } from "../../hooks/DashboardHook";
import ElectionPageHeader from "../../components/Commons/ElectionPageHeader";
import StatSection from "../../components/Dashboard/StatsComponent";
import ActionSection from "../../components/Dashboard/ActionSection";
import DashboardSidebar from "../../components/Dashboard/DashboardSidebar";
import FooterCard from "../../components/Commons/FooterCard";

const DashboardPage = () => {
    const { dashboardData, loading, error } = useDashboardStats();

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorCard message={error} />;

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-600 via-indigo-800 to-blue-500">
            {/* Header Section */}
            <div className="pt-10 pb-10 px-4">
                <ElectionPageHeader
                    title="Arbi1Vote Dashboard"
                    description="Secure, transparent, and decentralized voting platform"
                    backLink="/logout"
                    backLabel="Logout"
                />
            </div>

            {/* Main Content Section */}
            <div className="bg-white dark:bg-gray-900 min-h-screen rounded-t-3xl px-4 py-8 transition-colors duration-200">
                <div className="max-w-6xl mx-auto">
                    {/* Stats Section */}
                    <StatSection stats={dashboardData?.stats} />

                    {/* Actions Section */}
                    <ActionSection />
                </div>

                {/* Dashboard Sidebar */}
                <DashboardSidebar />

                {/* Footer */}
                <FooterCard />
            </div>
        </div>
    );
};

export default DashboardPage;