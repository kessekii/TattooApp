import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { getImageByImageId, getImageIdsByUserId, getPointsInRadius, getUserMapImagesByUserId } from "../../hooks/useChat"
import { getAvatars, getPointImageByPointId } from "../../utils/helpers/helperFuncs";
import { getNewsAction } from "../action-creators";
import { Post } from "./postsSlice";

export interface newsActions {
    getNewsDataAction: (location: string) => void;
  }

  export const  getNewsDataAction = createAsyncThunk('news/get',async (location: string) => await getNewsAction(location))
   



export interface NewsState {
  events: any;
  posts: any;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
const initialState: NewsState = {
    events: null,
    posts: null,
  status: 'idle',
  error: null,
};



  const newsSlice = createSlice({
    name: 'news',
    initialState,
    reducers: {
      setEvents (state, action: PayloadAction<Event>) {
        state.events = action.payload
      },
      setNews (state, action: PayloadAction<any>) {
        state.events = action.payload.events;
        state.posts = action.payload.posts
      }
    },
    extraReducers: (builder) => {
      
      builder.addCase(getNewsDataAction.fulfilled, (state, action) => {
        if (action.payload) {
            state.posts = action.payload.posts;
            state.events = action.payload.events;
        }
      });
    },
  });
  
  export const newsDataActions = { ...newsSlice.actions, getNewsDataAction };
  export const newsReducer =  newsSlice.reducer;
  