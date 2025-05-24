import { Clock } from "lucide-react";
import ElectionStats from "../ElectionStats";
import WinnerCard from "../WinnerCard";
import CandidateResults from "../CandidateResultsCard";

const ResultsCard = ({ result, status }) => {
    return (
        <div className="bg-white min-h-screen rounded-t-3xl px-4 py-8">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Election Results</h2>

                {result ? (
                    <div>
                        {result.stats && <ElectionStats stats={result.stats} />}
                        {result.winner && <WinnerCard winner={result.winner} />}
                        <CandidateResults result={result} />
                    </div>
                ) : (
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center">
                        <Clock className="h-12 w-12 text-indigo-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Results Not Available</h3>
                        <p className="text-gray-600 mb-4">
                            {status === "Not Started"
                                ? "This election has not started yet."
                                : status === "Vote In Progress"
                                    ? "This election is still in progress. Results will be available once it concludes."
                                    : "Results for this election have not been published yet."}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResultsCard;