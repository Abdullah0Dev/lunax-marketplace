import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stores: [],
  products: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavoriteStore: (state, action) => {
      const index = state.stores.findIndex(s => s.id === action.payload.id);
      if (index === -1) {
        state.stores.push(action.payload);
      } else {
        state.stores.splice(index, 1);
      }
    },
    toggleFavoriteProduct: (state, action) => {
      const index = state.products.findIndex(p => p.id === action.payload.id);
      if (index === -1) {
        state.products.push(action.payload);
      } else {
        state.products.splice(index, 1);
      }
    },
    isStoreFavorite: (state, storeId) => {
      return state.stores.some(s => s.id === storeId);
    },
    isProductFavorite: (state, productId) => {
      return state.products.some(p => p.id === productId);
    },
    clearFavorites: (state) => {
      state.stores = [];
      state.products = [];
    },
  },
});

export const favoritesActions = favoritesSlice.actions;
export default favoritesSlice.reducer;
