import {
  configureStore,
  combineReducers,
  Reducer,
  StateFromReducersMapObject,
} from "@reduxjs/toolkit";
import { persistStore, persistReducer, PersistConfig } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { UserState, userActions, userReducer } from "./features/userSlice";

import {
  FriendState,
  friendActions,
  friendReducer,
} from "./features/friendSlice";

import {
  ImagesState,
  imagesActions,
  imagesReducer,
} from "./features/imagesSlice";

import { PostsState, postsActions, postsReducer } from "./features/postsSlice";

import {
  NewsState,
  newsActions,
  newsDataActions,
  newsReducer,
} from "./features/newsSlice";
import { ChatState, chatsActions, chatsReducer } from "./features/chatsSlice";
import {
  friendPostsReducer,
  friendPostsActions,
  FriendPostsState,
} from "./features/friendPostsSlice";
import { pointActions, pointReducer, PointState } from "./features/pointsSlice";

// YOU SHOULD ADD HERE OTHER REDUCERS AS YOU CREATE NEW FEATURES
export const sliceActionsCombined: ActionTypes = {
  user: userActions,
  friend: friendActions,
  images: imagesActions,
  posts: postsActions,
  news: newsDataActions,
  chats: chatsActions,
  friendPosts: friendPostsActions,
  points: pointActions,
};

export interface ActionTypes {
  user: typeof userActions;
  friend: typeof friendActions;
  images: typeof imagesActions;
  posts: typeof postsActions;
  news: typeof newsDataActions;
  chats: typeof chatsActions;
  friendPosts: typeof friendPostsActions;
  points: typeof pointActions;
}

export type ActionState = {
  user: UserState;
  friend: FriendState;
  images: ImagesState;
  posts: PostsState;
  news: NewsState;
  chats: ChatState;
  friendPosts: FriendPostsState;
  points: PointState;
};
export type SlicesState = typeof sliceActionsCombined;

// Define the RootState interface based on the combined reducers
const rootReducer = combineReducers({
  user: userReducer,
  friend: friendReducer,
  images: imagesReducer,
  posts: postsReducer,
  news: newsReducer,
  chats: chatsReducer,
  friendPosts: friendPostsReducer,
  points: pointReducer,
});

// Type for the root state
export type RootState = ReturnType<typeof rootReducer>;

// Persist configuration with types
const persistConfig: PersistConfig<RootState> = {
  key: "root",
  storage,
};

// Apply the persistReducer to the rootReducer
const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer);

// Configure the store with types
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});
export const defultLocation = {
  lat: 32.02119878251853,
  lng: 34.74333323660794,
};
// Create the persistor instance for our store
export const persistor = persistStore(store);

// Export AppDispatch type for use with dispatch
export type AppDispatch = typeof store.dispatch;
