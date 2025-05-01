import { useEffect, useState } from 'react';
import { AlertCircle, Search, Filter } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import ElectionCard from '../../components/ElectionView/ElectionCard';
import { fetchAllElections } from "../../redux/thunks/electionThunks";

const ElectionPage = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const { elections, loading, error } = useSelector(state => state.election);

  useEffect(() => {
    dispatch(fetchAllElections());
  }, [dispatch]);

  return (
      <div className="container py-5">
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold mb-3">Upcoming Elections</h1>
          <p className="lead text-secondary col-lg-8 mx-auto">
            Browse elections and cast a vote for your candidate.
          </p>
        </div>

        <div className="row mb-5">
          <div className="col-md-8 offset-md-2">
            <div className="input-group shadow-sm rounded-3">
            <span className="input-group-text bg-white border-end-0">
              <Search size={18} className="text-muted" />
            </span>
              <input
                  type="text"
                  className="form-control border-start-0 rounded-3"
                  placeholder="Search elections..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-outline-secondary d-flex align-items-center rounded-3" type="button">
                <Filter size={18} className="me-2" />
                Filter
              </button>
            </div>
          </div>
        </div>

        {elections.length > 0 ? (
            <div className="row">
              <div className="col-lg-10 offset-lg-1">
                {elections
                    .filter(election =>
                        election.title.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((election) => (
                        <ElectionCard key={election.id} election={election} />
                    ))
                }
              </div>
            </div>
        ) : (
            <div className="card bg-light border-0 shadow-sm p-4 text-center col-lg-8 mx-auto">
              <AlertCircle className="text-primary mx-auto mb-3" size={48} />
              <h2 className="h4 fw-bold mb-2">No Upcoming Elections</h2>
              <p className="text-secondary">Check back later for new voting opportunities.</p>
            </div>
        )}

        <div className="card mt-5 bg-primary bg-opacity-10 border-0 p-5 col-lg-10 mx-auto shadow-sm">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h3 className="h5 fw-bold mb-3">Want to learn more about the voting process?</h3>
              <p className="mb-md-0">Check our FAQ section for detailed information about elections and voting procedures.</p>
            </div>
            <div className="col-md-4 text-md-end">
              <button className="btn btn-outline-primary px-4 py-2 rounded-full transition-all duration-300 hover:bg-primary hover:text-white">
                View FAQ
              </button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default ElectionPage;
