import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import cacheReducer from "../features/auth/cacheSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

// Configuration for redux-persist
const persistConfig = {
  key: 'root',
  storage,
  // We ONLY want to persist the 'cache' slice.
  // The 'auth' slice should be re-initialized from cookies on each load.
  whitelist: ['cache'],
};

// Combine your reducers before persisting
const rootReducer = combineReducers({
  auth: authReducer,
  cache: cacheReducer,
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer, // Use the persisted reducer
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // This is required to avoid errors with non-serializable actions from redux-persist
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Export the persistor which will be used by the PersistGate
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;