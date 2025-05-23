import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, Filter, Calendar, Users, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchAllElections } from "../../redux/thunks/electionThunks";

const ElectionHistoryPage = () => {
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState("");
    const { elections } = useSelector((state) => state.election);

    useEffect(() => {
        dispatch(fetchAllElections());
    }, [dispatch]);

    const getStatus = (election) => {
        const now = new Date();
        if (new Date(election.startDate) > now) return "Not Started";
        if (new Date(election.endDate) < now) return "Closed";
        return "Vote In Progress";
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-700 to-indigo-500">
            {/* Header Section */}
            <div className="pt-10 pb-16 px-4">
                <div className="text-center mb-6">
                    <h1 className="text-4xl font-bold text-white mb-2">Election History</h1>
                    <p className="text-indigo-100 max-w-2xl mx-auto">
                        View past and current elections with detailed turnout and results.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-2 flex">
                    <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-indigo-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2.5 border-0 rounded-lg focus:outline-none focus:ring-0"
                            placeholder="Search elections by title, year, or type..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center ml-2">
                        <Filter className="h-5 w-5 mr-2" />
                        Advanced Filters
                    </button>
                </div>
            </div>

            {/* Content Section */}
            <div className="bg-white min-h-screen rounded-t-3xl px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        Election Results <span className="text-gray-500 font-normal">({elections.length} election{elections.length !== 1 ? 's' : ''})</span>
                    </h2>

                    {elections.length > 0 ? (
                        elections
                            .filter((election) =>
                                election.title.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .map((election) => {
                                const status = getStatus(election);

                                return (
                                    <div
                                        key={election.id}
                                        className="bg-white rounded-lg border border-gray-200 shadow-sm mb-4 p-6 relative"
                                    >
                                        <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 text-sm rounded-full ${
                          status === "Vote In Progress"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-700"
                      }`}>
                        {status}
                      </span>
                                        </div>

                                        <h3 className="text-xl font-semibold text-indigo-700 mb-2">
                                            {election.title}
                                        </h3>

                                        <div className="flex items-center text-gray-500 mb-6">
                                            <Calendar className="h-4 w-4 mr-2" />
                                            <span className="text-sm">
                        {new Date(election.startDate).toLocaleDateString()} - {new Date(election.endDate).toLocaleDateString()}
                      </span>
                                        </div>

                                        <div className="mb-6">
                                            <div className="flex items-center mb-2">
                                                <Users className="h-4 w-4 mr-2 text-indigo-600" />
                                                <span className="text-sm font-medium text-gray-700">Voter Turnout</span>
                                            </div>
                                            <div className="bg-gray-200 h-2 rounded-full w-full">
                                                <div
                                                    className="bg-indigo-500 h-2 rounded-full"
                                                    style={{ width: `${election.turnoutPercentage || 0}%` }}
                                                ></div>
                                            </div>
                                            <div className="text-right mt-1">
                        <span className="text-sm font-medium text-gray-700">
                          {election.turnoutPercentage || "N/A"}%
                        </span>
                                            </div>
                                        </div>

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
                            })
                    ) : (
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center">
                            <p className="text-gray-600 mb-4">No elections found matching your search criteria.</p>
                            <button
                                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                                onClick={() => setSearchTerm("")}
                            >
                                Clear Search
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ElectionHistoryPage;