import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Axios } from 'axios';
import { endpoints } from '../../config';
import AxiosCustom from '../../utils/Axios'
import { getUserById } from '../../hooks/useChat';




export interface friendActions {
    
    getFriendData: (username: string) => void;
  
  }

export interface FriendState {
  data: Friend | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: FriendState = {
  data: null,
  status: 'idle',
  error: null,
};

interface Friend {
  name: string;
  username: string;
  type: string;
  location: string;
  backdrop: string;
  description: string;
  profilePicture: string;
  posts: any[];
  reviews: any[];
  friends: any[];
  socialLinks: any[];
  calendar: any[];
  map: any[];
}
const initialUserState = {

  name: "John Doe",
  username: "jondoe",
  type: "Master",
  location: "New York City",
  description: "Photographer | Traveler",
  profilePicture: "profile-picture.jpg",
  posts: [],
  reviews: [
    {
      photo: "client1.jpg",
      nickname: "Alice",
      text: "Amazing photographer!",
      mark: 5,
    },
    {
      photo: "client2.jpg",
      nickname: "Alice",
      text: "Loved the pictures!",
      mark: 4,
    },
    {
      photo: "client3.jpg",
      nickname: "Alice",
      text: "Great experience.",
      mark: 5,
    },
  ],
  friends: [
    { avatar: "friend1.jpg", nickname: "Alice", username: "alice" },
    { avatar: "friend2.jpg", nickname: "Bob", username: "bob" },
    { avatar: "friend3.jpg", nickname: "Charlie", username: "charlie" },
    { avatar: "friend4.jpg", nickname: "Dave", username: "dave" },
  ],
  socialLinks: [
    { platform: "Instagram", url: "https://www.instagram.com" },
    { platform: "Facebook", url: "https://www.facebook.com" },
    { platform: "Twitter", url: "https://www.twitter.com" },
    { platform: "LinkedIn", url: "https://www.linkedin.com" },
  ],
  calendar: [
    { date: "2024-10-01", hours: ["5", "7"] },
    { date: "2024-10-02", hours: ["5", "6", "7"] },
    { date: "2024-10-04", hours: ["5", "6", "7"] },
  ],
  map: [],
}


const getFriendData = createAsyncThunk('friend/data', async (username: any) => (await getUserById(username)).payload);




const friendSlice = createSlice({
  name: 'friend',
  initialState,
  reducers: {
    setFriend(state, action: PayloadAction<Friend>) {
      
        state.data = action.payload;
      },
  },
  extraReducers: (builder) => {
    builder.addCase(getFriendData.fulfilled, (state, action) => {
      state.data = action.payload;
    });

  },
});

export const friendActions = { ...friendSlice.actions, getFriendData };
export const friendReducer = friendSlice.reducer;

