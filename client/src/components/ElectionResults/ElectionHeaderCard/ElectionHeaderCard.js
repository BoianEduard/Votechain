import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const ElectionHeader = ({ election, status }) => {
    const statusColor =
        status === "Vote In Progress"
            ? "bg-emerald-100 text-emerald-800"
            : status === "Closed"
                ? "bg-indigo-100 text-indigo-800"
                : "bg-slate-100 text-slate-800";

    return (
        <div className="pt-10 pb-10 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="flex mb-6 justify-center">
                    <Link
                        to="/election-history"
                        className="inline-flex items-center text-white hover:text-indigo-200"
                    >
                        <ArrowLeft className="mr-2" size={16} />
                        Back to Election History
                    </Link>
                </div>

                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-2">{election.title}</h1>
                    <p className="text-indigo-100 max-w-2xl mx-auto mb-6">
                        View detailed results and statistics for this election.
                    </p>

                    <div className="inline-block">
                        <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusColor}`}>
                            {status}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ElectionHeader;