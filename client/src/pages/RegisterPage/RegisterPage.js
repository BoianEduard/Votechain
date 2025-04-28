import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
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
      <div className="flex justify-center items-center min-h-screen bg-light">
        <div className="bg-white shadow-lg rounded-3 p-6 w-full max-w-md">
          <h1 className="text-center text-2xl font-semibold text-primary mb-2">Votechain</h1>
          <p className="text-center text-sm text-gray-500 mb-4">Create your account</p>

          {error && <div className="alert alert-danger py-2 mb-4">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                    type="text"
                    id="firstName"
                    className="w-full p-2 mt-1 border rounded-md shadow-sm bg-light"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={isLoading}
                    required
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                    type="text"
                    id="lastName"
                    className="w-full p-2 mt-1 border rounded-md shadow-sm bg-light"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={isLoading}
                    required
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                  type="email"
                  id="email"
                  className="w-full p-2 mt-1 border rounded-md shadow-sm bg-light"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                  type="password"
                  id="password"
                  className="w-full p-2 mt-1 border rounded-md shadow-sm bg-light"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
              />
            </div>

            <button
                type="submit"
                className="w-full py-2 bg-blue-500 text-white rounded-full mb-4 hover:bg-blue-600 transition"
                disabled={isLoading}
            >
              {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                    Signing up...
                  </>
              ) : "Sign up"}
            </button>

            <p className="text-center text-sm text-gray-500">
              Already have an account? <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700">Log in</Link>
            </p>
          </form>
        </div>
      </div>
  );
};

export default RegisterPage;