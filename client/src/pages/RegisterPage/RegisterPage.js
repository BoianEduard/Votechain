import React from 'react';
import { useRegisterForm, useRegister } from '../../hooks/RegisterHook';
import ErrorMessage from '../../components/Commons/Error';
import LoadingSpinner from '../../components/Commons/LoadingSpinner'; // Import spinner-ul
import AuthContainer from '../../components/Auth/AuthContainer';
import AuthHead from '../../components/Auth/AuthHead';
import AuthInput from '../../components/Auth/AuthInput';
import AuthButton from '../../components/Auth/AuthButton';
import AuthFooter from '../../components/Auth/AuthFooter';

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

  if (isLoading) {
    return (
        <AuthContainer>
          <LoadingSpinner message="Creating account..." />
        </AuthContainer>
    );
  }

  return (
      <AuthContainer>
        <AuthHead subtitle="Create your account to get started" />

        {error && <ErrorMessage error={error} />}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <AuthInput
                id="firstName"
                type="text"
                label="First Name"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => updateField('firstName', e.target.value)}
                disabled={isLoading}
                required
            />

            <AuthInput
                id="lastName"
                type="text"
                label="Last Name"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => updateField('lastName', e.target.value)}
                disabled={isLoading}
                required
            />
          </div>

          <AuthInput
              id="email"
              type="email"
              label="Email Address"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              disabled={isLoading}
              required
          />

          <AuthInput
              id="password"
              type="password"
              label="Password"
              placeholder="Create a password"
              value={formData.password}
              onChange={(e) => updateField('password', e.target.value)}
              disabled={isLoading}
              required
          />

          <AuthButton
              type="submit"
              disabled={isLoading}
              isLoading={isLoading}
              loadingText="Creating account..."
          >
            Create account
          </AuthButton>
        </form>

        <AuthFooter
            text="Already have an account?"
            linkText="Sign in"
            linkTo="/login"
        />
      </AuthContainer>
  );
};

export default RegisterPage;