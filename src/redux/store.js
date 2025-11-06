
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { persistReducer, persistStore } from 'redux-persist';
import { MMKV } from 'react-native-mmkv';

import authReducer from './slices/authSlice';
import usersReducer from './slices/usersSlice';
import rootSaga from './rootSaga';

const storage = new MMKV(); // CREATE MMKV instance

// Wrap MMKV to look like AsyncStorage for redux-persist
const reduxStorage = {
  setItem: (key, value) => {
    storage.set(key, value);
    return Promise.resolve(true);
  },
  getItem: (key) => {
    const value = storage.getString(key);
    return Promise.resolve(value ?? null);
  },
  removeItem: (key) => {
    storage.delete(key);
    return Promise.resolve();
  },
};

const sagaMiddleware = createSagaMiddleware();

const rootReducer = combineReducers({
  auth: authReducer,
  users: usersReducer,
});

const persistedReducer = persistReducer(
  { key: 'root', storage: reduxStorage, whitelist: ['auth', 'users'] },
  rootReducer
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefault) =>
    getDefault({ serializableCheck: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export const persistor = persistStore(store);
