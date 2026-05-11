// store/slices/auth.slice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  user: null,
  store: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, user, store } = action.payload;
      state.token = token;
      state.user = user;
      state.store = store;
      state.isAuthenticated = true;
      state.error = null;
    },
    setStore: (state, action) => {
      state.store = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.store = null;
      state.isAuthenticated = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;