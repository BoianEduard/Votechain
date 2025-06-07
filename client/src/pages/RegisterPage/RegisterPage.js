import React from 'react';
import { Link } from 'react-router-dom';
import { useRegisterForm, useRegister } from '../../hooks/RegisterHook';

const RegisterPage = () => {
  const { formData, updateField, resetForm, validateForm } = useRegisterForm();
  const { register, error, isLoading } = useRegister();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateForm();
    if (!validation.isValid) {
      //TODO sa afisam erorile mai frumos..
      return;
    }

    const result = await register(formData);
    if (result.success) {
      resetForm();
    }
  };

  return (
      <div className="flex justify-center items-center min-h-screen bg-light">
        <div className="bg-white shadow-lg rounded-3 p-6 w-full max-w-md">
          <h1 className="text-center text-3xl font-bold text-indigo-700 mb-2">Arbi1Vote</h1>
          <p className="text-center text-sm text-gray-500 mb-4">Create your account</p>

          {error && (
              <div className="alert alert-danger py-2 mb-4">{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                    type="text"
                    id="firstName"
                    className="w-full p-2 mt-1 border rounded-md shadow-sm bg-light"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={(e) => updateField('firstName', e.target.value)}
                    disabled={isLoading}
                    required
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                    type="text"
                    id="lastName"
                    className="w-full p-2 mt-1 border rounded-md shadow-sm bg-light"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={(e) => updateField('lastName', e.target.value)}
                    disabled={isLoading}
                    required
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                  type="email"
                  id="email"
                  className="w-full p-2 mt-1 border rounded-md shadow-sm bg-light"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  disabled={isLoading}
                  required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                  type="password"
                  id="password"
                  className="w-full p-2 mt-1 border rounded-md shadow-sm bg-light"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
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
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
  );
};

export default RegisterPage;