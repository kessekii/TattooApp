import { Middleware, Reducer, combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";

import { thunk } from "redux-thunk";
import loginReducer from "./loginReducer";
import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import livestreamReducer from "./livestreamReducer";
import { Action } from "../actions";
import deviceReducer from "./deviceReducer";
import chatReducer from "./chatReducer";
import userReducer from "./userReducer";
import notifyReducer from "./notifyReducer";
import modalReducer from "./modalReducer";
import profileDataReducer from "./profileDataReducer";

const persistConfig = {
  key: "root",
  storage: storage,
  whitelist: ["login", "livestreams", "livestreams/createStream", "profile", "device", "device/setCurrentBreakpoint", "device/toggleProfileMenu", "device/addMobileOverlay", "device/removeMobileOverlay", "device/setCurrentBreakpoint", "device/toggleProfileMenu", "device/addMobileOverlay", "device/removeMobileOverlay", "chat", "chat/init_messages", "chat/add_message", "chat/delete_message", "chat/delete_messages_by_user_id", "chat/set_connection_state", "chat/set_chat_capabilities", 'user', 'user/setSessionValidity', 'user/setUserData', 'notify', 'notify/addNotification', 'notify/removeNotification'],
};

export const rootReducer: Reducer<any, Action> = combineReducers({
  login: loginReducer,
  livestream: livestreamReducer,
  device: deviceReducer,
  profile: profileDataReducer,
  user: userReducer,
  notify: notifyReducer,
  modal: modalReducer,
});

export const persistedReducer = persistReducer(persistConfig, rootReducer);

export type RootState = ReturnType<typeof rootReducer>;
