
import { createSlice } from '@reduxjs/toolkit';

const initial = { user: null, loading: false, error: null };

const authSlice = createSlice({
  name: 'auth',
  initialState: initial,
  reducers: {
    // Login
    loginRequest: (s) => { s.loading = true; s.error = null; },
    loginSuccess: (s, a) => { s.loading = false; s.user = a.payload; },
    loginFailure: (s, a) => { s.loading = false; s.error = a.payload; },

    // Logout
    logoutRequest: (s) => { s.loading = true; s.error = null; },
    logoutSuccess: (s) => { s.loading = false; s.user = null; },
    logoutFailure: (s, a) => { s.loading = false; s.error = a.payload; },

    // Register
    registerRequest: (s) => { s.loading = true; s.error = null; },
    registerSuccess: (s, a) => { s.loading = false; s.user = a.payload; },
    registerFailure: (s, a) => { s.loading = false; s.error = a.payload; },
  },
});

export const {
  loginRequest, loginSuccess, loginFailure,
  logoutRequest, logoutSuccess, logoutFailure,
  registerRequest, registerSuccess, registerFailure,
} = authSlice.actions;

export default authSlice.reducer;
