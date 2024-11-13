import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Axios } from 'axios';
import { endpoints } from '../../config';
import AxiosCustom from '../../utils/Axios'
import { Post } from './postsSlice';


export interface userActions {
  loginAction: (username: string, password: string) => void;
  registerAction: () => void;
}



export interface UserState {
  data: User | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UserState = {
  data: null,
  status: 'idle',
  error: null,
};

interface User {
  name: string;
  username: string;
  type: string;
  backdrop: string;
  location: string;
  description: string;
  profilePicture: string;
  posts: Post[];
  reviews: any[];
  friends: User[];
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


const loginAction = createAsyncThunk('user/login', async (loginParams: any) => {
  try {
  const headers = {
    Authorization: "Bearer " + "AIzaSyC3zvtXPRpuYYTKEJsZ6WXync_-shMPkHM",
  };
  const user = JSON.stringify(loginParams);
  // const loggetting = await AxiosCustom.post(
    //   "http://46.117.80.103:4000:8000",
    //   loginParams,
    //   {
      //     headers,
      //   }
      // );
      //;
      const { data } = await AxiosCustom.post(endpoints.LOGIN, loginParams, {
        headers,
      });
      
    
  if (!data.successful) {
  
    return data.payload;
  }
  return data.payload;
} catch (err) {
  
  return false;
}
});

const registerAction = createAsyncThunk('user/register', async (user: any, setErrorMessage: any) => {

    try {
      const headers = {
        Authorization: "Bearer " + "AIzaSyC3zvtXPRpuYYTKEJsZ6WXync_-shMPkHM",
      };
      const { data } = await AxiosCustom.post(endpoints.REGISTER, user, {
        headers,
      });

      if (!data.successful) {
        setErrorMessage(data.payload);
        return;
      }
    return data.payload
    } catch (err) {
      setErrorMessage(err);
      console.error(err);
    }

});


const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      
      state.data = action.payload;
    },
    
    
    logout(state) {
      state.data = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(loginAction.fulfilled, (state, action) => {
      state.data = action.payload;
    });
    builder.addCase(registerAction.fulfilled, (state, action) => {
      state.data = action.payload;
    });
  },
});

export const userActions = { ...userSlice.actions, loginAction, registerAction };
export const userReducer =  userSlice.reducer;

