import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Calendar, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchAllElections } from "../../redux/thunks/electionThunks";
import ElectionPageHeader from "../../components/Commons/ElectionPageHeader";
import ElectionPageSearch from "../../components/Commons/ElectionPageSearch";
import HistoryTurnoutCard from "../../components/ElectionHistory/HistoryTurnoutCard"; // Update the path as needed

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

    const handleFilterClick = () => {
        console.log("Filter clicked");
    };

    // Filter elections based on search term
    const filteredElections = elections.filter((election) =>
        election.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-700 to-indigo-500">
            <div className="pt-10 pb-10 px-4">
                <ElectionPageHeader
                    title="Create new election"
                    description="Set up a secure election process"
                    backLink="/dashboard"
                    backLabel="Back to Dashboard"
                />
                <ElectionPageSearch
                    placeholder="Search elections..."
                    buttonLabel="Filter"
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    onFilterClick={handleFilterClick}
                />
            </div>

            <div className="bg-white min-h-screen rounded-t-3xl px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        Election Results{" "}
                        <span className="text-gray-500 font-normal">
              ({filteredElections.length} election
                            {filteredElections.length !== 1 ? "s" : ""})
            </span>
                    </h2>

                    {filteredElections.length > 0 ? (
                        filteredElections.map((election) => {
                            const status = getStatus(election);

                            return (
                                <div
                                    key={election.id}
                                    className="bg-white rounded-lg border border-gray-200 shadow-sm mb-4 p-6 relative"
                                >
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

                                    {/* Use HistoryTurnoutCard here */}
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
                        })
                    ) : (
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center">
                            <p className="text-gray-600 mb-4">
                                No elections found matching your search criteria.
                            </p>
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