
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addUserRequest } from '../redux/slices/usersSlice';
import { logoutRequest } from '../redux/slices/authSlice';
import ProfileScreen from '../screens/ProfileScreen';


jest.mock('../i18n/i18n', () => ({
  t: key => key,
  use: () => {},
  init: () => {},
  changeLanguage: jest.fn(),
  language: 'en',
}));


jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: key => key,
  }),
}));


jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
  Provider: ({ children }) => children,
}));

describe('ProfileScreen Tests', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockImplementation(sel =>
      sel({
        auth: { user: { email: 'test@example.com' } },
        users: { loading: false, isConnected: true },
      })
    );
  });

  it('renders user email', () => {
    const { getByText } = render(<ProfileScreen />);
    expect(getByText('test@example.com')).toBeTruthy();
  });

  it('dispatches addUserRequest on valid submit', async () => {
  const { getByPlaceholderText, getByText } = render(<ProfileScreen />);

  fireEvent.changeText(getByPlaceholderText('NAME'), 'John');
  fireEvent.changeText(getByPlaceholderText('EMAIL'), 'john@example.com');
  fireEvent.changeText(getByPlaceholderText('PHONE'), '9876543210');
  fireEvent.changeText(getByPlaceholderText('WEBSITE'), 'https://example.com');

  fireEvent.press(getByText('ADD_USER'));

  // Give React Hook Form time to validate and trigger submit
  await waitFor(() => expect(mockDispatch).toHaveBeenCalled(), { timeout: 1000 });

  //  Verify the correct action type was dispatched
  expect(mockDispatch.mock.calls[0][0].type).toBe(addUserRequest().type);
});

  it('dispatches logoutRequest on logout press', () => {
    const { getByText } = render(<ProfileScreen />);
    fireEvent.press(getByText('LOGOUT'));
    expect(mockDispatch).toHaveBeenCalledWith(logoutRequest());
  });
});
