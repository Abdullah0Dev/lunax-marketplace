import { configureStore } from "@reduxjs/toolkit";

import favoriteReducer from "./reducers/favoriteReducer";

const store = configureStore({
  reducer: {
    favorites: favoriteReducer,
  },
});

export default store;
 