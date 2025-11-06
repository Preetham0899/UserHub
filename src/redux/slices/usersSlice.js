
import { createSlice } from '@reduxjs/toolkit';

const initial = {
  seed: [],         // Users from Axios
  custom: [],       // Users from Firestore (your own added users)
  loading: false,
  error: null,
  queue: [],        // Offline queue: [{ type:'ADD_USER', payload }]
  isConnected: true,
};

const usersSlice = createSlice({
  name: 'users',
  initialState: initial,
  reducers: {
    fetchSeedRequest: (s) => { s.loading = true; s.error = null; },
    fetchSeedSuccess: (s, a) => { s.loading = false; s.seed = a.payload; },
    fetchSeedFailure: (s, a) => { s.loading = false; s.error = a.payload; },

    setCustomUsers: (s, a) => { s.custom = a.payload || []; },

    addUserRequest: (s) => { s.loading = true; s.error = null; },
    addUserSuccess: (s) => { s.loading = false; },
    addUserFailure: (s, a) => { s.loading = false; s.error = a.payload; },

    deleteUserRequest: (state, action) => {
      state.loading = true;
    },
    deleteUserSuccess: (state, action) => {
      const id = action.payload;
      state.custom = state.custom.filter((user) => user.id !== id);
      state.loading = false;
    },
    deleteUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  

    enqueueAction: (s, a) => { s.queue.push(a.payload); }, // USED FOR OFFLINE QUEUE
    clearQueue: (s) => { s.queue = []; },

    connectivityChanged: (s, a) => { s.isConnected = a.payload; }, //
  },
});

export const {
  fetchSeedRequest, fetchSeedSuccess, fetchSeedFailure,
  setCustomUsers,
  addUserRequest, addUserSuccess, addUserFailure,
  deleteUserRequest,
  deleteUserSuccess,
  deleteUserFailure,
  enqueueAction, clearQueue,
  connectivityChanged,
} = usersSlice.actions;

export default usersSlice.reducer;
