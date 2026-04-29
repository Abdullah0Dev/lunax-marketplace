// store/slices/offline.slice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  queue: [],
  isSyncing: false,
  lastSync: null,
  networkStatus: 'online', // 'online' or 'offline'
};

const offlineSlice = createSlice({
  name: 'offline',
  initialState,
  reducers: {
    addToQueue: (state, action) => {
      state.queue.push({
        ...action.payload,
        id: Date.now().toString(),
        retryCount: 0,
      });
    },
    removeFromQueue: (state, action) => {
      state.queue = state.queue.filter(item => item.id !== action.payload);
    },
    updateQueueItem: (state, action) => {
      const index = state.queue.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.queue[index] = { ...state.queue[index], ...action.payload };
      }
    },
    clearQueue: (state) => {
      state.queue = [];
      state.lastSync = Date.now();
    },
    setSyncing: (state, action) => {
      state.isSyncing = action.payload;
    },
    setNetworkStatus: (state, action) => {
      state.networkStatus = action.payload;
    },
    syncComplete: (state) => {
      state.isSyncing = false;
      state.lastSync = Date.now();
    },
  },
});

export const offlineActions = offlineSlice.actions;
export default offlineSlice.reducer;