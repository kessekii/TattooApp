import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { getImageByImageId, getImageIdsByUserId, getPointsInRadius, getPostsByUserId, getUserMapImagesByUserId } from "../../hooks/useChat"
import { getAvatars, getPointImageByPointId } from "../../utils/helpers/helperFuncs";

export interface postsActions {
  getPostsByUserIdAction: (username: string) => void;
  }

  export const  getPostsByUserIdAction = createAsyncThunk('posts/get',async (username: string) => await getPostsByUserId(username))
   
export interface Post {
  [id: string] : any
}


export interface PostsState {
  data: Post | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
const initialState: PostsState = {
  data: null,
  status: 'idle',
  error: null,
};



  const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
      setPosts: (state, action: PayloadAction<Post>) => {
        state.data = action.payload
      }
    },
    extraReducers: (builder) => {
      
      builder.addCase(getPostsByUserIdAction.fulfilled, (state, action) => {
        state.data = action.payload.payload;
      });
    },
  });
  
  export const postsActions = { ...postsSlice.actions, getPostsByUserIdAction };
  export const postsReducer = postsSlice.reducer;
  
  