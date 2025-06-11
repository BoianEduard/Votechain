import React from 'react';
import { useAuthForm, useLogin } from '../../hooks/LoginHook';
import ErrorMessage from '../../components/Commons/Error';
import AuthContainer from '../../components/Auth/AuthContainer';
import AuthHead from '../../components/Auth/AuthHead';
import AuthInput from '../../components/Auth/AuthInput';
import AuthButton from '../../components/Auth/AuthButton';
import AuthFooter from '../../components/Auth/AuthFooter';
import LoadingSpinner from "../../components/Commons/LoadingSpinner";

const LoginPage = () => {
  const { formData, updateField, resetForm } = useAuthForm();
  const { login, error, isLoading } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await login(formData);
    if (result.success) {
      resetForm();
    }
  };

  if (isLoading) {
    return (
        <AuthContainer>
          <LoadingSpinner message="Logging into account..." />
        </AuthContainer>
    );
  }

  return (
      <AuthContainer>
        <AuthHead subtitle="Welcome back! Please sign in to your account." />

        {error && <ErrorMessage error={error} />}

        <form onSubmit={handleSubmit} className="space-y-6">
          <AuthInput
              id="email"
              type="email"
              label="Email address"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              disabled={isLoading}
              required
          />

          <AuthInput
              id="password"
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => updateField('password', e.target.value)}
              disabled={isLoading}
              required
          />

          <AuthButton
              type="submit"
              disabled={isLoading}
              isLoading={isLoading}
              loadingText="Signing in..."
          >
            Sign in
          </AuthButton>
        </form>

        <AuthFooter
            text="Don't have an account?"
            linkText="Sign up"
            linkTo="/signup"
        />
      </AuthContainer>
  );
};

export default LoginPage;