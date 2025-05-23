import { ArrowLeft, Calendar } from "lucide-react";

const ResultsHeader = ({ election, onBack }) => {
    const getStatus = () => {
        const now = new Date();
        if (new Date(election.startDate) > now) return "Not Started";
        if (new Date(election.endDate) < now) return "Closed";
        return "Vote In Progress";
    };

    const status = getStatus();

    return (
        <div className="pt-6 pb-10 px-4">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={onBack}
                    className="inline-flex items-center text-white mb-4 hover:bg-white/10 rounded-full px-3 py-1"
                >
                    <ArrowLeft size={16} className="mr-1" />
                    Back to Election History
                </button>

                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            {election.title}
                        </h1>
                        <div className="flex items-center text-indigo-100">
                            <Calendar className="mr-2" size={16} />
                            <span>
                {new Date(election.startDate).toLocaleDateString()} - {new Date(election.endDate).toLocaleDateString()}
              </span>
                        </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        status === "Vote In Progress"
                            ? "bg-green-100 text-green-800"
                            : status === "Closed"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                    }`}>
            {status}
          </span>
                </div>
            </div>
        </div>
    );
};

export default ResultsHeader;