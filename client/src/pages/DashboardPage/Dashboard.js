import React from "react";
import Dashboard from "../../components/Dashboard/DashboardComponent";
import LoadingSpinner from "../../components/Commons/LoadingSpinner";
import ErrorCard from "../../components/Commons/Error";
import { useDashboardStats } from "../../hooks/DashboardHook";

const DashboardPage = () => {
    const { dashboardData, loading, error } = useDashboardStats();

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorCard message={error} />;

    return <Dashboard stats={dashboardData.stats} />;
};

export default DashboardPage;