import { useEffect, useState } from 'react';
import { AlertCircle, Search, Filter, HelpCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import ElectionCard from '../../components/ElectionView/ElectionCard';
import { fetchAllElections } from "../../redux/thunks/electionThunks";

const ElectionViewPage = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const { elections, loading, error } = useSelector(state => state.election);

  useEffect(() => {
    dispatch(fetchAllElections());
  }, [dispatch]);

  return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-700 to-indigo-500">
        {/* Header Section */}
        <div className="pt-10 pb-16 px-4">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-white mb-2">Upcoming Elections</h1>
            <p className="text-indigo-100 max-w-2xl mx-auto">
              Browse elections and cast a vote for your candidate.
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
                  placeholder="Search elections..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center ml-2">
              <Filter className="h-5 w-5 mr-2" />
              Filter
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white min-h-screen rounded-t-3xl px-4 py-8">
          <div className="max-w-3xl mx-auto">
            {elections.length > 0 ? (
                elections
                    .filter(election =>
                        election.title.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((election) => (
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