import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import authThunks from '../../redux/thunks/authThunks';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { errorMessage, loading } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await dispatch(authThunks.loginUser({ email, password }));
      setEmail('');
      setPassword('');
      navigate('/dashboard')
    } catch (err) {
      setError(errorMessage || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg rounded-3 p-4" style={{ width: '380px' }}>
        <h1 className="text-center fw-bold text-primary mb-2">Votechain</h1>
        <p className="text-center text-muted mb-4">Welcome back! Please login to your account.</p>
        
        {error && <div className="alert alert-danger py-2 mb-4">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="form-label small fw-semibold">Email address</label>
            <input
              type="email"
              id="email"
              className="form-control py-2 bg-light border-0 shadow-sm"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="password" className="form-label small fw-semibold">Password</label>
            <input
              type="password"
              id="password"
              className="form-control py-2 bg-light border-0 shadow-sm"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary w-100 py-2 shadow-sm rounded-pill mb-3" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Logging in...
              </>
            ) : 'Login'}
          </button>
        </form>
        
        <p className="text-center mt-3 mb-0">
          Don't have an account? <Link to="/signup" className="text-decoration-none fw-bold">Sign up!</Link>
        </p>
      </div>
    </div>
  );
};


export default LoginPage;
