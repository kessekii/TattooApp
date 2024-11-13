import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { getImageByImageId, getImageIdsByUserId, getPointsInRadius, getPostsByUserId, getUserMapImagesByUserId } from "../../hooks/useChat"
import { getAvatars, getPointImageByPointId } from "../../utils/helpers/helperFuncs";

export interface friendPostsActions {
  getFriendPostsAction: (username: string) => void;
  }

  export const  getFriendPostsAction = createAsyncThunk('friendPosts/get',async (username: string) => await getPostsByUserId(username))
   
interface friendPost {
  [id: string] : any
}


export interface FriendPostsState {
  data: friendPost | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
const initialState: FriendPostsState = {
  data: null,
  status: 'idle',
  error: null,
};



  const friendPostsSlice = createSlice({
    name: 'friendPosts',
    initialState,
    reducers: {
      setFriendPosts(state, action: PayloadAction<friendPost>) {
        state.data = action.payload;
      },
    },
    
    extraReducers: (builder) => {
      
      builder.addCase(getFriendPostsAction.fulfilled, (state, action) => {
        state.data = action.payload;
      });
    },
  });
  
  export const friendPostsActions = { ...friendPostsSlice.actions, getFriendPostsAction };
  export const friendPostsReducer =  friendPostsSlice.reducer;
  
  