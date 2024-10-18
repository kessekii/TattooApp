import { configureStore, Middleware } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';
import { thunk } from 'redux-thunk';
import { persistedReducer } from './reducers/index';

export const store = configureStore({
	reducer: persistedReducer,
	devTools: process.env.NODE_ENV !== 'production',
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: ['persist/PERSIST'],
				ignoredPaths: ['some.path.that.is.non.serializable'], // Update this path as needed
			}
		}).concat(thunk as Middleware<any, any, any>), // Cast thunk as Middleware to resolve the type issue
})



export const persistor = persistStore(store);

export default { store, persistor };