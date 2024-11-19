import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getImageByImageId,
  getImageIdsByUserId,
  getPointsInRadius,
  getUserMapImagesByUserId,
} from "../../hooks/useChat";
import {
  getAvatars,
  getPointImageByPointId,
} from "../../utils/helpers/helperFuncs";

export interface pointActions {
  getPointByUserIdAction: (username: string) => void;
}

export const getPointByUserIdAction = createAsyncThunk(
  "point/get",
  async (username: string) =>
    await getPointsInRadius(
      {
        lat: 32.02119878251853,
        lng: 34.74333323660794,
      },
      username
    )
);

export interface Point {
  [id: string]: any;
}

export interface PointState {
  data: Point | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
const initialState: PointState = {
  data: null,
  status: "idle",
  error: null,
};

const pointSlice = createSlice({
  name: "point",
  initialState,
  reducers: {
    setPoint: (state, action: PayloadAction<Point>) => {
      console.log("action.payload", action.payload);
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPointByUserIdAction.fulfilled, (state, action) => {
      state.data = action.payload;
    });
  },
});

export const pointActions = { ...pointSlice.actions, getPointByUserIdAction };
export const pointReducer = pointSlice.reducer;
