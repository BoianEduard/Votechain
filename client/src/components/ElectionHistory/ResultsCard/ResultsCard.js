import { ExternalLink, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import HistoryTurnoutCard from "../HistoryTurnoutCard/HistoryTurnoutCard";
import { useElectionStatus } from "../../../hooks/ElectionHistoryHook";

const ResultsCard = ({ election }) => {
    const { getStatus } = useElectionStatus();
    const status = getStatus(election);

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-4 p-6 relative">
            <div className="absolute top-4 right-4">
                <span
                    className={`px-3 py-1 text-sm rounded-full ${
                        status === "Vote In Progress"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-700"
                    }`}
                >
                    {status}
                </span>
            </div>

            <h3 className="text-xl font-semibold text-indigo-700 mb-2">
                {election.title}
            </h3>

            <div className="flex items-center text-gray-500 mb-6">
                <Calendar className="h-4 w-4 mr-2" />
                <span className="text-sm">
                    {new Date(election.startDate).toLocaleDateString()} -{" "}
                    {new Date(election.endDate).toLocaleDateString()}
                </span>
            </div>

            <HistoryTurnoutCard electionId={election.id} />

            <div className="text-right">
                <Link
                    to={`/election-results/${election.id}`}
                    className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
                >
                    View Results
                    <ExternalLink className="h-4 w-4 ml-2" />
                </Link>
            </div>
        </div>
    );
};

export default ResultsCard;