import { Middleware, Reducer, combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";

import { thunk } from "redux-thunk";
import loginReducer from "./loginReducer";
import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage: storage,
  whitelist: ["login", "users"],
};

const rootReducer: Reducer<any, any> = combineReducers({
  login: loginReducer,
});

export const persistedReducer = persistReducer(persistConfig, rootReducer);

export type RootState = ReturnType<typeof rootReducer>;
