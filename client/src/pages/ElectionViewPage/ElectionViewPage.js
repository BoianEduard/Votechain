import { AlertCircle, HelpCircle } from 'lucide-react';
import { useElectionData, useElectionSearch } from "../../hooks/ElectionViewHook";
import ElectionCard from '../../components/ElectionView/ElectionCard';
import ElectionPageHeader from "../../components/Commons/ElectionPageHeader";
import ElectionPageSearch from "../../components/Commons/ElectionPageSearch";
import LoadingSpinner from "../../components/Commons/LoadingSpinner";
import ErrorCard from "../../components/Commons/Error/ErrorCard";

const ElectionViewPage = () => {
  const { elections, loading, error } = useElectionData();
  const { searchTerm, setSearchTerm, filteredElections } = useElectionSearch(elections);

  const handleFilterClick = () => {
    console.log("Filter clicked");
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorCard message={error} />;

  return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-700 to-indigo-500">
        <div className="pt-10 pb-6 px-4">
          <ElectionPageHeader
              title="Upcoming Elections"
              description="Browse elections and cast a vote for your candidate."
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

        {/* Content Section */}
        <div className="bg-white min-h-screen rounded-t-3xl px-4 py-8">
          <div className="max-w-3xl mx-auto">
            {elections.length > 0 ? (
                filteredElections.map((election) => (
                    <ElectionCard key={election.id} election={election} />
                ))
            ) : (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center mb-8">
                  <AlertCircle className="text-indigo-500 mx-auto mb-3" size={48} />
                  <h2 className="text-xl font-bold mb-2">No Upcoming Elections</h2>
                  <p className="text-gray-600">Check back later for new voting opportunities.</p>
                </div>
            )}

            {/* FAQ Section */}
            <div className="bg-indigo-50 rounded-lg border border-indigo-100 p-6 mt-8 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-4 md:mb-0 md:mr-6">
                  <div className="flex items-center mb-2">
                    <HelpCircle className="text-indigo-600 mr-2" size={20} />
                    <h3 className="text-lg font-semibold text-gray-800">Want to learn more about the voting process?</h3>
                  </div>
                  <p className="text-gray-600">
                    Check our FAQ section for detailed information about elections and voting procedures.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <button className="px-5 py-2.5 rounded-full border border-indigo-500 text-indigo-600 font-medium hover:bg-indigo-600 hover:text-white transition-colors">
                    View FAQ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default ElectionViewPage;