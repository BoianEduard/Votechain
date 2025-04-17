import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom"
import authThunks from "../../redux/thunks/authThunks";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !firstName || !lastName) {
      setError("All fields are required.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await dispatch(authThunks.registerUser({ email, password, firstName, lastName }));
      alert("Registration successful!");
      
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg rounded-3 p-4" style={{ width: '420px' }}>
        <h1 className="text-center fw-bold text-primary mb-1">Votechain</h1>
        <p className="text-center text-muted mb-4">Create your account</p>
        
        {error && <div className="alert alert-danger py-2 mb-4">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label htmlFor="firstName" className="form-label small fw-semibold">First Name</label>
              <input
                type="text"
                id="firstName"
                className="form-control py-2 bg-light border-0 shadow-sm"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            
            <div className="col-md-6">
              <label htmlFor="lastName" className="form-label small fw-semibold">Last Name</label>
              <input
                type="text"
                id="lastName"
                className="form-control py-2 bg-light border-0 shadow-sm"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>
          
          <div className="mb-3">
            <label htmlFor="email" className="form-label small fw-semibold">Email Address</label>
            <input
              type="email"
              id="email"
              className="form-control py-2 bg-light border-0 shadow-sm"
              placeholder="Enter your email address"
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
              placeholder="Create a password"
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
                Signing up...
              </>
            ) : "Sign up"}
          </button>
          
          <p className="text-center text-muted mt-3 mb-0">
            Already have an account? <Link to="/login" className="text-decoration-none fw-bold">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
