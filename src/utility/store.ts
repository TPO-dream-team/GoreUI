//Glavni REDUX store
import { configureStore, combineReducers, type Middleware } from '@reduxjs/toolkit';
import authReducer from '@/utility/stores_slices/authSlice';
import goreReducer from '@/utility/stores_slices/goreSlice';
import scanReducer, { syncMiddleware } from '@/utility/stores_slices/scanSlice';

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
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'mountain', 'scans']
};

const rootReducer = combineReducers({
  auth: authReducer,
  mountain: goreReducer,
  scans: scanReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions to avoid console warnings
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(syncMiddleware as Middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


