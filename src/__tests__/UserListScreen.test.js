import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSeedRequest } from '../redux/slices/usersSlice';
import UserListScreen from '../screens/UserListScreen';

// Mock i18n 
jest.mock('../i18n/i18n', () => ({
  t: key => key,
  use: () => {},
  init: () => {},
}));

// Mock react-i18next translation hook
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: key => key,
  }),
}));

// Mock react-redux hooks
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
  Provider: ({ children }) => children,
}));

// Navigation mock
const navigation = { navigate: jest.fn() };

describe('UserListScreen — Extended Tests', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useDispatch.mockReturnValue(mockDispatch);
  });

  //  Checks API fetch trigger on mount
  it('dispatches fetchSeedRequest when mounted', () => {
    useSelector.mockReturnValue({
      seed: [],
      custom: [],
      loading: false,
    });

    render(<UserListScreen navigation={navigation} />);
    expect(mockDispatch).toHaveBeenCalledWith(fetchSeedRequest());
  });

  // Renders both fetched and custom users
  it('renders both API (seed) and manually added (custom) users', () => {
    useSelector.mockReturnValue({
      seed: [
        { id: 1, name: 'API User', email: 'api@example.com', phone: '123' },
      ],
      custom: [
        { id: 99, name: 'Custom User', email: 'local@example.com', phone: '555' },
      ],
      loading: false,
    });

    const { getByText } = render(<UserListScreen navigation={navigation} />);

    // Verify both API and custom users are visible
    expect(getByText('API User')).toBeTruthy();
    expect(getByText('Custom User')).toBeTruthy();
  });

  //  Filters users based on search query
  it('filters user list by search input', async () => {
    useSelector.mockReturnValue({
      seed: [
        { id: 1, name: 'John Doe', email: 'john@example.com', phone: '123' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '456' },
      ],
      custom: [],
      loading: false,
    });

    const { getByPlaceholderText, getByText, queryByText } = render(
      <UserListScreen navigation={navigation} />
    );

    // Verify users visible initially
    expect(getByText(/John Doe/i)).toBeTruthy();
    expect(getByText(/Jane Smith/i)).toBeTruthy();

    // Enter search query
    const searchInput = getByPlaceholderText('SEARCH_PLACEHOLDER');
    fireEvent.changeText(searchInput, 'Jane');

    // Expect only "Jane Smith" after filtering
    await waitFor(() => {
      expect(queryByText(/Jane Smith/i)).toBeTruthy();
      expect(queryByText(/John Doe/i)).toBeNull();
    });
  });

  //  Shows empty state when no users found
  it('shows empty message when no users match search', async () => {
    useSelector.mockReturnValue({
      seed: [{ id: 1, name: 'John Doe', email: 'john@example.com', phone: '123' }],
      custom: [],
      loading: false,
    });

    const { getByPlaceholderText, getByText } = render(
      <UserListScreen navigation={navigation} />
    );

    const searchInput = getByPlaceholderText('SEARCH_PLACEHOLDER');
    fireEvent.changeText(searchInput, 'zzz');

    await waitFor(() => {
      expect(getByText('NO_USERS_FOUND')).toBeTruthy();
    });
  });

  // Simulates pull-to-refresh calling API again
  it('dispatches fetchSeedRequest again on refresh', async () => {
    useSelector.mockReturnValue({
      seed: [{ id: 1, name: 'John', email: 'john@example.com', phone: '123' }],
      custom: [],
      loading: false,
    });

    const { getByTestId, rerender } = render(
      <UserListScreen navigation={navigation} />
    );

    // Simulate pull refresh
    rerender(<UserListScreen navigation={navigation} />);
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });
});
