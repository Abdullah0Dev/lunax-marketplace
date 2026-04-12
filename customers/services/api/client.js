// services/api/client.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

// const BASE_URL = 'http://localhost:4000/api/customer';
const BASE_URL = 'https://lunax-marketplace.dmsystem.dpdns.org/api/customer';

// Cache keys for offline data
const CACHE_KEYS = {
  STORES: 'cached_stores',
  PRODUCTS: 'cached_products',
  REELS: 'cached_reels',
  DISCOUNTS: 'cached_discounts',
};

// Base query with caching headers
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: async (headers) => {
    headers.set('Accept', 'application/json');
    headers.set('Content-Type', 'application/json');
    
    // Add cache control headers
    headers.set('Cache-Control', 'max-age=3600');
    
    return headers;
  },
});

// Custom base query with offline cache
const baseQueryWithCache = async (args, api, extraOptions) => {
  const { dispatch } = api;
  const netInfo = await NetInfo.fetch();
  const isConnected = netInfo.isConnected;

  // Try to get from network if online
  if (isConnected) {
    try {
      const result = await baseQuery(args, api, extraOptions);
      
      // Cache successful GET requests
      if (!result.error && args.method === 'GET') {
        const cacheKey = `${CACHE_KEYS[args.url.split('/')[1]?.toUpperCase()]}_${args.url}`;
        await AsyncStorage.setItem(cacheKey, JSON.stringify({
          data: result.data,
          timestamp: Date.now(),
        }));
      }
      
      return result;
    } catch (error) {
      console.log('Network request failed, falling back to cache:', error);
    }
  }

  // Try to get from cache (offline or network failed)
  const cacheKey = `${CACHE_KEYS[args.url.split('/')[1]?.toUpperCase()]}_${args.url}`;
  const cached = await AsyncStorage.getItem(cacheKey);
  
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    const age = Date.now() - timestamp;
    
    return {
      data,
      cached: true,
      cacheAge: age,
    };
  }

  // No cache available
  return {
    error: {
      status: 'OFFLINE',
      message: 'You are offline. No cached data available.',
    },
  };
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithCache,
  tagTypes: ['Store', 'Product', 'Reel', 'Discount', 'Category'],
  endpoints: () => ({}),
  keepUnusedDataFor: 60 * 60 * 24 * 7, // 7 days
});