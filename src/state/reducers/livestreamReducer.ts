import { UserInterface } from "../../models/model.interface";
import { ActionType } from "../action-types/index";
import { Action } from "../actions";

export interface livestreamReducerInterface {
  streamId: string;
  chatId: string;
}

const initialState: livestreamReducerInterface = {
  streamId: "",
  chatId: "",
};

const reducer = (
  state: livestreamReducerInterface = initialState,
  action: Action
): livestreamReducerInterface => {
  switch (action.type) {
    case ActionType.LIVESTREAMCREATE:
      console.log("action.payload", action);

      return action.payload;
    case ActionType.LIVESTREAMS:
      console.log("action.payload", action);

      return action.payload;

    default:
      return state;
  }
};

export default reducer;
