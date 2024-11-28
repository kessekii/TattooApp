import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";


export interface SettingsActions {
    setIsEditing: any;
}



export interface SettingsState {
    isEditing: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
const initialState: SettingsState = {
  isEditing: false,
  status: "idle",
  error: null,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setIsEditing: (state, action: PayloadAction<boolean>) => {
      console.log("action.payload", action.payload);
      state.isEditing = action.payload;
    },
  },
 

});

export const settingsActions = { ...settingsSlice.actions};
export const settingsReducer = settingsSlice.reducer;
