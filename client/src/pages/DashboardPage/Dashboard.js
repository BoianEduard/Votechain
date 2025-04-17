import React, { useState, useEffect } from "react";
import Dashboard from "../../components/Dashboard/DashboardComponent";

const DashboardPage = () => {
    const [dashboardData, setDashboardData] = useState({
        stats: [
            { label: "Active Elections", value: 5, color: "#4361ee" },
            { label: "Votes Cast", value: 3500, color: "#2ec4b6" },
            { label: "Participants", value: 1500, color: "#e63946" }
        ]
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);

                setTimeout(() => {
                    setDashboardData({
                        stats: [
                            { label: "Active Elections", value: 5, color: "#4361ee" },
                            { label: "Votes Cast", value: 3500, color: "#2ec4b6" },
                            { label: "Participants", value: 1500, color: "#e63946" }
                        ]
                    });

                    setLoading(false);
                }, 2000);
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
                setError("Failed to load dashboard data. Please try again later.");
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger m-5" role="alert">
                {error}
            </div>
        );
    }

    return <Dashboard stats={dashboardData.stats} />;
};

export default DashboardPage;
