import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    ArrowLeft,
    Users,
    Award,
    BarChart2,
    Percent,
    Clock
} from "lucide-react";
import { fetchElectionDetails } from "../../redux/thunks/electionThunks";

const ElectionResultPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    const election = useSelector((state) =>
        state.election.elections.find((e) => e.id === id)
    );
    const result = useSelector((state) =>
        state.election.results?.find((r) => r.electionId === id)
    );

    useEffect(() => {
        const loadElection = async () => {
            setLoading(true);
            await dispatch(fetchElectionDetails(id));
            setLoading(false);
        };

        loadElection();
    }, [dispatch, id]);

    const getStatus = () => {
        if (!election) return "Unknown";

        const now = new Date();
        if (new Date(election.startDate) > now) return "Not Started";
        if (new Date(election.endDate) < now) return "Closed";
        return "Vote In Progress";
    };

    const status = getStatus();
    const statusColor =
        status === "Vote In Progress"
            ? "bg-emerald-100 text-emerald-800"
            : status === "Closed"
                ? "bg-indigo-100 text-indigo-800"
                : "bg-slate-100 text-slate-800";

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-indigo-600 font-medium">Loading election results...</p>
                </div>
            </div>
        );
    }

    if (!election) {
        return (
            <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Election Not Found</h2>
                    <p className="text-gray-600 mb-6">
                        The election you're looking for doesn't exist or has been removed.
                    </p>
                    <Link
                        to="/election-history"
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        <ArrowLeft className="mr-2" size={16} />
                        Back to Election History
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-700 to-indigo-500">
            {/* Header Section - Matched to screenshot */}
            <div className="pt-8 pb-12 px-4">
                <div className="max-w-3xl mx-auto">
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
                Vote In Progress
              </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="bg-white min-h-screen rounded-t-3xl px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Election Results</h2>

                    {result ? (
                        <div>
                            {/* Winner Card */}
                            <div className="bg-amber-50 border border-amber-100 rounded-lg p-6 mb-6">
                                <div className="flex items-center mb-4">
                                    <Award className="text-amber-600 mr-3" size={24} />
                                    <div>
                                        <span className="text-sm text-slate-500">Election Winner</span>
                                        <h3 className="text-xl font-bold text-slate-800">{result.electionWinner}</h3>
                                    </div>
                                </div>
                            </div>

                            {/* Voter Turnout Card */}
                            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6">
                                <div className="flex items-center mb-4">
                                    <Users className="text-indigo-600 mr-3" size={20} />
                                    <h3 className="text-lg font-semibold text-gray-800">Voter Turnout</h3>
                                </div>

                                <div className="mb-4">
                                    <div className="flex items-center mb-2">
                                        <Percent className="text-indigo-600 mr-2" size={16} />
                                        <span className="text-sm font-medium text-gray-700">Participation Rate</span>
                                    </div>
                                    <div className="bg-gray-200 h-4 rounded-full w-full">
                                        <div
                                            className="bg-indigo-500 h-4 rounded-full"
                                            style={{ width: `${result.voterTurnout}%` }}
                                        ></div>
                                    </div>
                                    <div className="text-right mt-1">
                    <span className="text-lg font-bold text-indigo-700">
                      {result.voterTurnout}%
                    </span>
                                    </div>
                                </div>
                            </div>

                            {/* Candidate Results */}
                            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                                <div className="flex items-center mb-4">
                                    <BarChart2 className="text-indigo-600 mr-3" size={20} />
                                    <h3 className="text-lg font-semibold text-gray-800">Candidate Results</h3>
                                </div>

                                {election.candidates && election.candidates.length > 0 ? (
                                    <div className="space-y-4">
                                        {election.candidates.map((candidate) => (
                                            <div key={candidate.id} className="border-b border-gray-100 pb-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center">
                                                        {candidate.imageUrl && (
                                                            <img
                                                                src={candidate.imageUrl}
                                                                alt={candidate.name}
                                                                className="w-10 h-10 rounded-full mr-3 object-cover"
                                                            />
                                                        )}
                                                        <div>
                                                            <h4 className="font-medium text-gray-800">{candidate.name}</h4>
                                                            {candidate.position && (
                                                                <p className="text-sm text-gray-500">{candidate.position}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <span className="text-lg font-bold text-indigo-700">
                            {candidate.votePercentage || "N/A"}%
                          </span>
                                                </div>

                                                <div className="bg-gray-200 h-2 rounded-full w-full">
                                                    <div
                                                        className={`h-2 rounded-full ${
                                                            candidate.name === result.electionWinner
                                                                ? "bg-amber-500"
                                                                : "bg-indigo-500"
                                                        }`}
                                                        style={{ width: `${candidate.votePercentage || 0}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-4">
                                        No candidate information available
                                    </p>
                                )}
                            </div>
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
        </div>
    );
};

export default ElectionResultPage;