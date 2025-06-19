import { ExternalLink, BarChart2, Calendar, Users, Award } from "lucide-react";
import { Link } from "react-router-dom";

const ResultsCard = ({ election }) => {
    const getStatus = () => {
        const now = new Date();
        if (new Date(election.startDate) > now) return "Not Started";
        if (new Date(election.endDate) < now) return "Closed";
        return "Vote In Progress";
    };

    const status = getStatus();
    const statusColor =
        status === "Vote In Progress"
            ? "bg-emerald-100 text-emerald-800 border-emerald-200"
            : status === "Closed"
                ? "bg-indigo-100 text-indigo-800 border-indigo-200"
                : "bg-slate-100 text-slate-800 border-slate-200";

    return (
        <div className="w-full mb-4">
            <div className="border rounded-lg shadow-sm hover:shadow-md transition-all bg-slate-50 w-full p-4 relative overflow-hidden">
                {/* Status badge in top-right corner */}
                <div className="absolute top-0 right-0">
          <span
              className={`px-3 py-1 text-xs rounded-bl-lg font-medium ${statusColor} border-l border-b`}
          >
            {status}
          </span>
                </div>

                <div className="mb-3 mt-1">
                    <h3 className="text-lg font-bold text-indigo-700 mb-1">{election.title}</h3>
                    <div className="flex items-center text-slate-500">
                        <Calendar className="mr-2" size={14} />
                        <p className="text-xs">
                            {new Date(election.startDate).toLocaleDateString()} - {" "}
                            {new Date(election.endDate).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                <div className="bg-slate-100 rounded p-3 mb-3">
                    <div className="flex items-center mb-1">
                        <Users className="text-indigo-600 mr-2" size={16} />
                        <span className="text-slate-700 text-sm font-medium">Voter Turnout</span>
                    </div>

                    <div className="flex items-center">
                        <div className="w-full bg-slate-200 rounded-full h-2 mr-2">
                            <div
                                className="bg-indigo-500 h-2 rounded-full"
                                style={{ width: `${election.turnoutPercentage || 0}%` }}
                            ></div>
                        </div>
                        <span className="text-indigo-700 font-bold min-w-[40px] text-right text-sm">
              {election.turnoutPercentage || "N/A"}%
            </span>
                    </div>
                </div>

                {election.winner && (
                    <div className="flex items-center mb-3 bg-amber-50 p-2 rounded border border-amber-100">
                        <Award className="text-amber-600 mr-2" size={16} />
                        <div>
                            <span className="text-xs text-slate-500">Winner</span>
                            <p className="font-semibold text-slate-800 text-sm">{election.winner}</p>
                        </div>
                    </div>
                )}

                <div className="flex justify-end">
                    <Link
                        to={`/election-results/${election.id}`}
                        className="inline-flex items-center px-3 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
                    >
                        <BarChart2 size={16} className="mr-1" />
                        View Results
                        <ExternalLink size={14} className="ml-1" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ResultsCard;