import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import authThunks from '../../redux/thunks/authThunks';
import './LoginPage.css';

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
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Votechain</h1>
        <p className="login-subtitle">Welcome back! Please login to your account.</p>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

        </form>

       <p className="signup-link"> 
        Don't have an account? <Link to ="/signup">Sign up!</Link> 
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
