import {useEffect, useState} from 'react';
import { AlertCircle, Search, Filter } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import ElectionCard from '../../components/ElectionView/ElectionCard';
import {fetchAllElections} from "../../redux/thunks/electionThunks";

const ElectionPage = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const { elections, loading, error } = useSelector(state => state.election);
  // const [elections, setElections] = useState([
  //   {
  //     id: '1',
  //     title: 'City Council Election 2024',
  //     description: 'Annual election for city council representatives',
  //     startDate: '2024-06-01',
  //     endDate: '2024-06-15',
  //     candidates: [
  //       {
  //         id: 'c1',
  //         name: 'Jane Smith',
  //         position: 'Council Member, District 3',
  //         description: 'Experienced local community leader with 10+ years of public service'
  //       },
  //       {
  //         id: 'c2',
  //         name: 'John Doe',
  //         position: 'Council Member, District 3',
  //         description: 'Small business owner committed to local economic development'
  //       }
  //     ]
  //   },
  //   {
  //     id: '2',
  //     title: 'State Senate Special Election',
  //     description: 'Special election to fill vacant state senate seat',
  //     startDate: '2024-07-10',
  //     endDate: '2024-07-24',
  //     candidates: [
  //       {
  //         id: 'c3',
  //         name: 'Maria Rodriguez',
  //         position: 'State Senator',
  //         description: 'Education policy expert with a focus on school funding reform'
  //       },
  //       {
  //         id: 'c4',
  //         name: 'Alex Chen',
  //         position: 'State Senator',
  //         description: 'Environmental lawyer advocating for climate action'
  //       }
  //     ]
  //   }
  // ]);

  useEffect(() => {
    dispatch(fetchAllElections());
  },[])

  return (
    <div className="container py-4">
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold mb-3">Upcoming Elections</h1>
        <p className="lead text-secondary col-lg-8 mx-auto">
          Browse elections and cast a vote for your candidate.
        </p>
      </div>
      
      <div className="row mb-4">
        <div className="col-md-6 offset-md-3">
          <div className="input-group">
            <span className="input-group-text bg-white">
              <Search size={18} />
            </span>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search elections..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-outline-secondary d-flex align-items-center" type="button">
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
      
      <div className="card mt-4 bg-primary bg-opacity-10 border-0 p-4 col-lg-10 mx-auto">
        <div className="row align-items-center">
          <div className="col-md-8">
            <h3 className="h5 fw-bold mb-2">Want to learn more about the voting process?</h3>
            <p className="mb-md-0">Check our FAQ section for detailed information about elections and voting procedures.</p>
          </div>
          <div className="col-md-4 text-md-end">
            <button className="btn btn-outline-primary">View FAQ</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElectionPage;
