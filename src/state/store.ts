import { configureStore, combineReducers, Reducer, StateFromReducersMapObject } from '@reduxjs/toolkit';
import { persistStore, persistReducer, PersistConfig } from 'redux-persist';
import storage from 'redux-persist/lib/storage';


import {UserState, userActions, userReducer} from './features/userSlice';



import {FriendState, friendActions, friendReducer} from './features/friendSlice';

import {ImagesState, imagesActions, imagesReducer} from './features/imagesSlice';

import {PostsState, postsActions, postsReducer} from './features/postsSlice';

import {NewsState, newsActions, newsDataActions, newsReducer} from './features/newsSlice';
import {ChatState, chatsActions,  chatsReducer} from './features/chatsSlice';
import {friendPostsReducer,friendPostsActions, FriendPostsState } from './features/friendPostsSlice';



// YOU SHOULD ADD HERE OTHER REDUCERS AS YOU CREATE NEW FEATURES
export const sliceActionsCombined: ActionTypes = {
 
  user: userActions,
  friend: friendActions,
  images: imagesActions,
  posts: postsActions,
  news: newsDataActions,
  chats: chatsActions,
  friendPosts: friendPostsActions
};


export interface ActionTypes {
  
  "user": typeof userActions,
  "friend": typeof friendActions, 
  "images": typeof imagesActions,
  "posts":  typeof postsActions,
  "news":  newsActions,
  "chats": typeof chatsActions, 
  "friendPosts":  typeof friendPostsActions, 

}

export type ActionState = {
  
  "user": UserState,
  "friend":  FriendState,
  "images":  ImagesState,
  "posts":   PostsState,
  "news": NewsState,
  "chats": ChatState,
  "friendPosts":  FriendPostsState,

}
export type SlicesState = typeof sliceActionsCombined

// Define the RootState interface based on the combined reducers
const rootReducer = combineReducers({
  
  user: userReducer,
  friend: friendReducer,
  images: imagesReducer,
  posts: postsReducer,
  news: newsReducer,
  chats: chatsReducer,
  friendPosts: friendPostsReducer,
  
});

// Type for the root state
export type RootState = ReturnType<typeof rootReducer>;

// Persist configuration with types
const persistConfig: PersistConfig<RootState> = {
  key: 'root',
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
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// Configure persistor for persistence
export const persistor = persistStore(store);

// Export AppDispatch type for use with dispatch
export type AppDispatch = typeof store.dispatch;
