// store/store.js
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer, persistStore } from 'redux-persist';
import { api } from '../api/client';

// Import reducers
import authReducer from './slices/auth.slice';
import offlineReducer from './slices/offline.slice';

// Persist config
const authPersistConfig = {
  key: 'auth',
  storage: AsyncStorage,
  whitelist: ['token', 'user', 'isAuthenticated'],
};

const offlinePersistConfig = {
  key: 'offline',
  storage: AsyncStorage,
  whitelist: ['queue'],
};

// Create persisted reducers
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedOfflineReducer = persistReducer(offlinePersistConfig, offlineReducer);

// Combine all reducers
const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  auth: persistedAuthReducer,
  offline: persistedOfflineReducer,
});

// Configure store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'],
        ignoredPaths: ['register'],
      },
      immutableCheck: false,
    }).concat(api.middleware),
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);