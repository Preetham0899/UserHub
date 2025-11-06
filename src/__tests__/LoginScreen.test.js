import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../screens/LoginScreen';
import { useDispatch, useSelector } from 'react-redux';
import { loginRequest } from '../redux/slices/authSlice';

// Mock Redux
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

// Mock navigation prop
const mockNavigation = { navigate: jest.fn() };

describe('LoginScreen Tests', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockReturnValue({ loading: false, error: null });
  });

  //  Rendering UI
  it('renders login form correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <LoginScreen navigation={mockNavigation} />
    );

    expect(getByText('Welcome Back')).toBeTruthy();
    expect(getByText('Login to your account')).toBeTruthy();
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('LogIn')).toBeTruthy();
  });

  //  Validation errors with empty inputs
  it('shows validation errors when submitting empty form', async () => {
    const { getByText } = render(<LoginScreen navigation={mockNavigation} />);
    fireEvent.press(getByText('LogIn'));

    await waitFor(() => {
      expect(getByText('Invalid email address')).toBeTruthy();
      expect(getByText('Password must be at least 6 characters')).toBeTruthy();
    });
  });

  //  Successful login dispatch
  it('dispatches loginRequest when valid credentials are entered', async () => {
    const { getByPlaceholderText, getByText } = render(
      <LoginScreen navigation={mockNavigation} />
    );

    fireEvent.changeText(getByPlaceholderText('Email'), 'john@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');

    fireEvent.press(getByText('LogIn'));

    await waitFor(() => expect(mockDispatch).toHaveBeenCalled());
    expect(mockDispatch.mock.calls[0][0].type).toBe(loginRequest().type);
  });

  //  Navigation to Register screen
  it('navigates to Register screen when link is pressed', () => {
    const { getByText } = render(<LoginScreen navigation={mockNavigation} />);
    fireEvent.press(getByText('Don’t have an account? Register'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Register');
  });

  //  Displays error message from Redux
  it('shows error message when login fails', () => {
    useSelector.mockReturnValue({ loading: false, error: 'Invalid credentials' });

    const { getByText } = render(<LoginScreen navigation={mockNavigation} />);
    expect(getByText('Invalid credentials')).toBeTruthy();
  });

  //Shows loading indicator when login is in progress
  it('shows loading indicator while logging in', () => {
    useSelector.mockReturnValue({ loading: true, error: null });
    const { getByTestId } = render(<LoginScreen navigation={mockNavigation} />);
    expect(getByTestId('ActivityIndicator')).toBeTruthy();
  });
});
