// store/store.js
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer, persistStore } from 'redux-persist';
import { api } from '../api/client';
import exploreReducer from './slices/explore.slice';
import favoritesReducer from './slices/favorites.slice';
import searchReducer from './slices/search.slice';

// Persist config for user preferences
const explorePersistConfig = {
  key: 'explore',
  storage: AsyncStorage,
  whitelist: ['recentlyViewed', 'categories'],
};

const cartPersistConfig = {
  key: 'cart',
  storage: AsyncStorage,
  whitelist: ['items', 'total'],
};

const favoritesPersistConfig = {
  key: 'favorites',
  storage: AsyncStorage,
  whitelist: ['stores', 'products'],
};

const searchPersistConfig = {
  key: 'search',
  storage: AsyncStorage,
  whitelist: ['recentSearches'],
};

// Create persisted reducers
const persistedExploreReducer = persistReducer(explorePersistConfig, exploreReducer);
const persistedFavoritesReducer = persistReducer(favoritesPersistConfig, favoritesReducer);
const persistedSearchReducer = persistReducer(searchPersistConfig, searchReducer);

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    explore: persistedExploreReducer,
    favorites: persistedFavoritesReducer,
    search: persistedSearchReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(api.middleware),
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);