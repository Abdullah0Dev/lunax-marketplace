import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  recentlyViewed: {
    stores: [],
    products: [],
  },
  categories: [],
  selectedCategory: null,
  featuredStores: [],
  isLoading: false,
};

const exploreSlice = createSlice({
  name: 'explore',
  initialState,
  reducers: {
    addRecentlyViewedStore: (state, action) => {
      state.recentlyViewed.stores = [
        action.payload,
        ...state.recentlyViewed.stores.filter(s => s.id !== action.payload.id)
      ].slice(0, 10);
    },
    addRecentlyViewedProduct: (state, action) => {
      state.recentlyViewed.products = [
        action.payload,
        ...state.recentlyViewed.products.filter(p => p.id !== action.payload.id)
      ].slice(0, 20);
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setFeaturedStores: (state, action) => {
      state.featuredStores = action.payload;
    },
    clearRecentlyViewed: (state) => {
      state.recentlyViewed = { stores: [], products: [] };
    },
  },
});

export const exploreActions = exploreSlice.actions;
export default exploreSlice.reducer;
