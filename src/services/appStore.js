import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./appSlice";

export const appStore = configureStore({
  reducer: {
    appStore: appReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
// export type AppDispatch = typeof store.dispatch;
/** @typedef { ReturnType<typeof appStore.getState>} RootState */
/** @typedef { typeof appStore.dispatch} AppDispatch */
