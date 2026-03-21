
// store/slices/search.slice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  recentSearches: [],
  searchResults: {
    stores: [],
    products: [],
    reels: [],
  },
  filters: {
    category: null,
    minPrice: null,
    maxPrice: null,
    sortBy: 'relevance',
  },
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    addRecentSearch: (state, action) => {
      state.recentSearches = [
        action.payload,
        ...state.recentSearches.filter(s => s !== action.payload)
      ].slice(0, 10);
    },
    clearRecentSearches: (state) => {
      state.recentSearches = [];
    },
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
});

export const searchActions = searchSlice.actions;
export default searchSlice.reducer;