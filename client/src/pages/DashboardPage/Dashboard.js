import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Dashboard from "../../components/Dashboard/DashboardComponent";
import DashboardSidebar from "../../components/Dashboard/DashboardSidebar";
import LoadingSpinner from "../../components/Commons/LoadingSpinner";
import ErrorCard from "../../components/Commons/Error";
import * as electionThunks from '../../redux/thunks/electionThunks'

const DashboardPage = () => {
    const [dashboardData, setDashboardData] = useState({
        stats: [
            { label: "Active Elections", value: 5, color: "#4361ee" },
            { label: "Votes Cast", value: 3500, color: "#2ec4b6" },
            { label: "Participants", value: 1500, color: "#e63946" },
        ],
    });
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const data = await dispatch(electionThunks.getDashboardStats());
                setDashboardData(data);
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
                setError("Failed to load dashboard data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorCard message={error} />;

    return <Dashboard stats={dashboardData.stats}/>;
};

export default DashboardPage;