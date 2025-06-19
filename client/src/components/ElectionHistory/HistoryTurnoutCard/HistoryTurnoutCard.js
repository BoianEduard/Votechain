import React, { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { useDispatch } from "react-redux";
import { getVoterTurnout } from "../../../redux/thunks/electionThunks";

const HistoryTurnoutCard = ({ electionId }) => {
    const [turnout, setTurnout] = useState({
        totalVoters: 0,
        currentTurnout: 0
    });
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const data = await dispatch(getVoterTurnout(electionId));
                setTurnout(data);
            } catch (err) {
                setError(err.message || "Could not load turnout");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [electionId]);

    if (loading) {
        return (
            <div className="text-sm text-gray-500">
                Loading turnout…
            </div>
        );
    }
    if (error) {
        return (
            <div className="text-sm text-red-500">
                Error loading turnout
            </div>
        );
    }

    const turnoutPercentage = turnout.totalVoters > 0
        ? Math.round((turnout.currentTurnout / turnout.totalVoters) * 100)
        : 0;

    return (
        <div className="mb-6">
            <div className="flex items-center mb-2">
                <Users className="h-4 w-4 mr-2 text-indigo-600" />
                <span className="text-sm font-medium text-gray-700">Voter Turnout</span>
            </div>
            <div className="bg-gray-200 h-2 rounded-full w-full">
                <div
                    className="bg-indigo-500 h-2 rounded-full"
                    style={{ width: `${turnoutPercentage}%` }}
                ></div>
            </div>
            <div className="text-right mt-1">
                <span className="text-sm font-medium text-gray-700">
                    {turnoutPercentage > 0 ? `${turnoutPercentage}%` : "N/A"}
                </span>
            </div>
        </div>
    );
};

export default HistoryTurnoutCard;