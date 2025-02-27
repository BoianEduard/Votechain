import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import LoginPage from './LoginPage';
import { loginUser } from '../../state/actions/authActions';

// Mock Redux store
const mockStore = configureStore([thunk]);

// Mock the loginUser action
jest.mock('../../state/actions/authActions', () => ({
  loginUser: jest.fn()
}));

// Mock navigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

describe('LoginPage Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      auth: {
        isAuthenticated: false,
        loading: false,
        error: null
      }
    });
    
    // Reset mocks
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </Provider>
    );
  };

  test('renders login form correctly', () => {
    renderComponent();
    
    expect(screen.getByText('Votechain')).toBeInTheDocument();
    expect(screen.getByText('Welcome back! Please login to your account.')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText('Remember me')).toBeInTheDocument();
    expect(screen.getByText('Forgot Password?')).toBeInTheDocument();
    expect(screen.getByText('Login to Account')).toBeInTheDocument();
    expect(screen.getByText('New to Votechain?')).toBeInTheDocument();
    expect(screen.getByText('Create an account')).toBeInTheDocument();
  });

  test('shows validation error when form is submitted without data', () => {
    renderComponent();
    
    const submitButton = screen.getByText('Login to Account');
    fireEvent.click(submitButton);
    
    expect(screen.getByText('Please enter both email and password')).toBeInTheDocument();
  });

  test('calls loginUser action and redirects on successful login', async () => {
    // Mock successful login
    loginUser.mockResolvedValue(true);
    
    renderComponent();
    
    // Fill in the form
    fireEvent.change(screen.getByPlaceholderText('Email address'), {
      target: { value: 'test@example.com' }
    });
    
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' }
    });
    
    // Submit the form
    const submitButton = screen.getByText('Login to Account');
    fireEvent.click(submitButton);
    
    // Check if loginUser was called with correct arguments
    expect(loginUser).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
      rememberMe: false
    });
    
    // Wait for navigation to occur
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('shows error message on failed login', async () => {
    // Mock failed login
    const errorMessage = 'Invalid credentials';
    loginUser.mockRejectedValue({
      response: { data: { message: errorMessage } }
    });
    
    renderComponent();
    
    // Fill in the form
    fireEvent.change(screen.getByPlaceholderText('Email address'), {
      target: { value: 'test@example.com' }
    });
    
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'wrongpassword' }
    });
    
    // Submit the form
    const submitButton = screen.getByText('Login to Account');
    fireEvent.click(submitButton);
    
    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
    
    // Check that navigation didn't occur
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
