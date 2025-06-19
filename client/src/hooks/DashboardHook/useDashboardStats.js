import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as electionThunks from "../../redux/thunks/electionThunks";

export const useDashboardStats = () => {
    const dispatch = useDispatch();
    const [dashboardData, setDashboardData] = useState({
        stats: [
            { label: "Active Elections", value: 5, color: "#4361ee" },
            { label: "Votes Cast", value: 3500, color: "#2ec4b6" },
            { label: "Participants", value: 1500, color: "#e63946" },
        ],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await dispatch(electionThunks.getDashboardStats());
                setDashboardData(data);
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
                const errorMessage = err?.message || err || "Failed to load dashboard data. Please try again later.";
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [dispatch]);

    return {
        dashboardData,
        loading,
        error
    };
};