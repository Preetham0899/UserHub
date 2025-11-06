import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import RegisterScreen from '../screens/RegisterScreen';
import { useDispatch, useSelector } from 'react-redux';
import { registerRequest } from '../redux/slices/authSlice';

// Mock Redux hooks
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

// Mock navigation prop
const mockNavigation = { navigate: jest.fn() };

describe('RegisterScreen Tests', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockReturnValue({ loading: false, error: null });
  });

  //  Render test
  it('renders register form correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <RegisterScreen navigation={mockNavigation} />
    );

    expect(getByText('Create Account')).toBeTruthy();
    expect(getByText('Register to continue')).toBeTruthy();
    expect(getByPlaceholderText('Name')).toBeTruthy();
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Register')).toBeTruthy();
  });

  //  Validation errors test
  it('shows validation errors when submitting empty form', async () => {
    const { getByText } = render(<RegisterScreen navigation={mockNavigation} />);
    fireEvent.press(getByText('Register'));

    await waitFor(() => {
      expect(getByText('Name must be at least 2 characters')).toBeTruthy();
      expect(getByText('Invalid email address')).toBeTruthy();
      expect(getByText('Password must be at least 6 characters')).toBeTruthy();
    });
  });

  //  Successful register dispatch
  it('dispatches registerRequest when valid inputs are entered', async () => {
    const { getByPlaceholderText, getByText } = render(
      <RegisterScreen navigation={mockNavigation} />
    );

    fireEvent.changeText(getByPlaceholderText('Name'), 'John');
    fireEvent.changeText(getByPlaceholderText('Email'), 'john@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');

    fireEvent.press(getByText('Register'));

    await waitFor(() => expect(mockDispatch).toHaveBeenCalled());
    expect(mockDispatch.mock.calls[0][0].type).toBe(registerRequest().type);
  });

  //  Navigation to Login screen
  it('navigates to Login screen when link is pressed', () => {
    const { getByText } = render(<RegisterScreen navigation={mockNavigation} />);
    fireEvent.press(getByText('Already have an account? Login'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');
  });

  //  Displays error message from Redux
  it('shows error message when registration fails', () => {
    useSelector.mockReturnValue({ loading: false, error: 'User already exists' });
    const { getByText } = render(<RegisterScreen navigation={mockNavigation} />);
    expect(getByText('User already exists')).toBeTruthy();
  });

  //  Shows loading indicator when registering
  it('shows loading indicator while registering', () => {
    useSelector.mockReturnValue({ loading: true, error: null });
    const { getByTestId } = render(<RegisterScreen navigation={mockNavigation} />);
    expect(getByTestId('ActivityIndicator')).toBeTruthy();
  });
});
