import { configureStore, combineReducers } from "@reduxjs/toolkit";

import blogReducer from "./blogSlice";
import podcastReducer from "./podcastSlice";
import userApi from "./authSlice";
import { roomApi } from "./srdClubSlice";
import userReducer from "./userSlice";
import storage from "redux-persist/lib/storage";
import {
  persistStore,
  persistReducer,
  REGISTER,
  PURGE,
  PERSIST,
  PAUSE,
  REHYDRATE,
  FLUSH,
} from "redux-persist";

const persistConfig = {
  key: "root", // The key for the persist
  storage, // The storage to use
  whitelist: ["user"], // Only persist the user reducer
};
// Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
  blog: blogReducer,
  podcast: podcastReducer,
  [userApi.reducerPath]: userApi.reducer,
  [roomApi.reducerPath]: roomApi.reducer,
});

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer, // use the persistedReducer instead of rootReducer
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .concat(userApi.middleware)
      .concat(roomApi.middleware),
});

// Persistor for the store
export const persistor = persistStore(store);
