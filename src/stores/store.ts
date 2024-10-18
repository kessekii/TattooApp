import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import usersReducer from './reducers/usersReducer';

const persistConfig = {
    key: 'root',
    storage,
};

const rootReducer = combineReducers({
    users: usersReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;

// Optionally export the dispatch type for use with useDispatch
export type AppDispatch = typeof store.dispatch;