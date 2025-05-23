import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux"; // Add useSelector
import { Link } from "react-router-dom";
import authThunks from "../../redux/thunks/authThunks";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [formError, setFormError] = useState(""); // Rename to formError to distinguish from Redux error

  const dispatch = useDispatch();

  const { loading: isLoading, error } = useSelector(state => state.auth);

  const validateForm = () => {
    const errors = {};

    if (!email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Email is invalid";

    if (!password) errors.password = "Password is required";
    else if (password.length < 8) errors.password = "Password must be at least 8 characters";

    if (!firstName) errors.firstName = "First name is required";
    if (!lastName) errors.lastName = "Last name is required";

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setFormError(Object.values(formErrors).join(" "));
      return;
    }

    setFormError("");

    try {
      await dispatch(authThunks.registerUser({ email, password, firstName, lastName }));
    } catch (err) {
    }
  };

  const displayError = formError || error;

  return (
      <div className="flex justify-center items-center min-h-screen bg-light">
        <div className="bg-white shadow-lg rounded-3 p-6 w-full max-w-md">
          <h1 className="text-center text-2xl font-semibold text-primary mb-2">Votechain</h1>
          <p className="text-center text-sm text-gray-500 mb-4">Create your account</p>

          {displayError && <div className="alert alert-danger py-2 mb-4">{displayError}</div>}
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
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    <span>Signing up...</span>
                  </div>
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