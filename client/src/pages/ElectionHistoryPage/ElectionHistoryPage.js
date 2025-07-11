import {
    useElectionData,
    useElectionSearch,
    useElectionStatus
} from "../../hooks/ElectionHistoryHook";
import ElectionPageHeader from "../../components/Commons/ElectionPageHeader";
import ElectionPageSearch from "../../components/Commons/ElectionPageSearch";
import ResultsCard from "../../components/ElectionHistory/ResultsCard";

const ElectionHistoryPage = () => {
    const { elections } = useElectionData();
    const { searchTerm, setSearchTerm, filteredElections, clearSearch } = useElectionSearch(elections);
    const { getStatus } = useElectionStatus();

    const handleFilterClick = () => {
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-red-500 via-purple-800 to-indigo-400">
            <div className="pt-10 pb-6 px-4">
                <ElectionPageHeader
                    title="History"
                    description="View your voting history"
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
                        filteredElections.map((election) => (
                            <ResultsCard key={election.id} election={election} />
                        ))
                    ) : (
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center">
                            <p className="text-gray-600 mb-4">
                                No elections found matching your search criteria.
                            </p>
                            <button
                                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                                onClick={clearSearch}
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