// services/api/client.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { offlineActions } from '../store/slices/offline.slice';

export const BASE_URL = 'https://lunax-marketplace.dmsystem.dpdns.org/api';
// http://localhost:4000/api/stores/69c6fe739ba19787f70b3539
// Base query with auth
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: async (headers) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    headers.set('Accept', 'application/json');
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

// Custom base query with offline support
const baseQueryWithOffline = async (args, api, extraOptions) => {
  const { dispatch } = api;

  // Check network status
  const netInfo = await NetInfo.fetch();
  const isConnected = netInfo.isConnected;

  // Update network status in store
  dispatch(offlineActions.setNetworkStatus(isConnected ? 'online' : 'offline'));

  // If online, proceed with request
  if (isConnected) {
    try {
      console.log("Making request to:", args);
      const result = await baseQuery(args, api, extraOptions);

      if (result.error) {
        console.error('API Error:', result.error);
      }
      return result;
    } catch (error) {
      console.error('Request failed:', error);
      return { error: { status: 'FETCH_ERROR', error: error.message } };
    }
  }

  // If offline and it's a mutation (POST, PUT, DELETE, PATCH)
  if (!isConnected && args.method && args.method !== 'GET') {
    // Queue the mutation
    dispatch(offlineActions.addToQueue({
      endpoint: args.url,
      method: args.method,
      body: args.body,
      timestamp: Date.now(),
    }));

    return {
      data: {
        queued: true,
        message: 'Operation saved offline. Will sync when online.',
      },
    };
  }

  // If offline GET request
  return {
    error: {
      status: 'OFFLINE',
      message: 'You are offline. Please check your connection.',
    },
  };
};

// Create API
export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithOffline,
  tagTypes: ['Store', 'Product', 'Reel', 'Discount'],
  endpoints: () => ({}),
  keepUnusedDataFor: 60 * 60 * 24 * 7, // Keep data for 7 days
  refetchOnMountOrArgChange: 30, // Refetch after 30 seconds
});