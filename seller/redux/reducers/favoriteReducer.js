import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  favoriteList: [],
};

const favoriteReducer = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addToFavorite(state, action) {
      const newFav = action.payload;

      if (!state.favoriteList.some((item) => item.id === newFav.id)) {
        state.favoriteList.push(newFav);
      } else {
        console.log("Item is already in the favorites.");
      }
    },
    removeFromFavorite(state, action) {
      const favoriteToRemove = action.payload;

      state.favoriteList = state.favoriteList.filter(
        (item) => item.id !== favoriteToRemove.id
      );
    },
    removeAllFavorites(state) {

      state.favoriteList = [];
      console.log("All favorites have been removed.");
    },
    setFavorites(state, action) {

      state.favoriteList = action.payload;
      console.log("Favorites loaded from storage.");
    },
  },
});

export const {
  addToFavorite,
  removeFromFavorite,
  removeAllFavorites,
  setFavorites,
} = favoriteReducer.actions;

export default favoriteReducer.reducer;
