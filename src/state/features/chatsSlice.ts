import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Axios } from 'axios';
import { endpoints } from '../../config';
import AxiosCustom from '../../utils/Axios'
import { getChatByChatId, getChatsByUserId, getPrivateChatsByUserId } from '../../hooks/useChat';
import { createChatByUsername } from '../action-creators';


export interface chatsActions {
  
  getPrivateChatsAction: (username: string) => void;
  getPublicChatsAction: (username: string) => void;
  createChatsAction: (username: string, post: any) => void;

}



export interface ChatState {
  privateChats: any | null;
  publicChats: any | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ChatState = {
    privateChats: null,
    publicChats: null,
  status: 'idle',
  error: null,
};

interface message {author:string,text:string,timestamp:Number}

interface Chat 
    {   [id: string]: {

        participants:any[];
        lastMessage: message;
        lastMessageTimestamp:Number,
        messages:message[],
        type:"private" | "post",
        lastMessageId:13
    }
    }

  export  const filterChats = (payload: any) => {
        const filteredPrivate = Object.assign({}, payload)
        let excludedKeys:string[] = []
          for (const key in payload) {
    
              if (payload[key] && payload[key].type !== 'post') {
                
                excludedKeys.push(key)

                }
                
                
                
            }
            const filteredPrivateChats = excludeKeys(filteredPrivate, excludedKeys)
        return filteredPrivateChats
    }
       const excludeKeys = (obj, keysToExclude) => {
  return Object.fromEntries(
    (Object.entries(obj)).filter(([key]: [string, any]) => !keysToExclude.includes(key) && ({filtered: !keysToExclude.includes(key), excluded: keysToExclude.includes(key)}))
  )}
  const handleGetPublicChats = async (username: any) => {
    try {

      const res = await getChatsByUserId(username);
     
            
        
        
        const resssvvc = filterChats(res.payload)
        

          return resssvvc
        
    
    

    

  } catch (e) {
    
  }
}

const getPrivateChatsAction = createAsyncThunk('chat/getPrivate', async (username: string) => await getPrivateChatsByUserId(username))

const getPublicChatsAction = createAsyncThunk('chat/getPublic', async (username: any) => await handleGetPublicChats(username))

const createChatsAction = createAsyncThunk('chat/createChat', async (username: any, post:any) => await createChatByUsername(username, null, post))

const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    setPrivateChats(state, action: PayloadAction<Chat>) {
        
        state.privateChats = action.payload.payload;
      },
    
    setPostChats(state, action: PayloadAction<Chat>) {
       
        const publicTemp = filterChats(action.payload);
        
        state.publicChats = publicTemp;
    }
},
  extraReducers: (builder) => {
    builder.addCase(getPrivateChatsAction.fulfilled, (state, action) => {
      state.privateChats = action.payload.payload;
    });
    builder.addCase(getPublicChatsAction.fulfilled, (state, action) => {
      state.publicChats = action.payload;
    });
    builder.addCase(createChatsAction.fulfilled, (state, action) => {
        state.publicChats = action.payload;
      });
  },
});

export const chatsActions = { ...chatsSlice.actions, getPrivateChatsAction, getPublicChatsAction, createChatsAction };
export const chatsReducer =  chatsSlice.reducer;

