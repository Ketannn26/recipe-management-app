// store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import recipeReducer from "./recipeSlice";
import cookbookReducer from "./cookbookSlice";

export const store = configureStore({
  reducer: {
    recipes: recipeReducer,
    cookbook: cookbookReducer,
  },
});

// These types are used throughout the app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
