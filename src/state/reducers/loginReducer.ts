import { User } from "../../pages/register/registerPage";
import { usersAction } from "../action-creators";
import { ActionType } from "../action-types/index";
import { Action } from "../actions";

export interface loginReducerInterface {
  ok: boolean;
  user: User;
}

const initialState: loginReducerInterface = {
  ok: false,
  user: {
    name: "",
    username: undefined,
    userEmail: undefined,
    password: undefined,
    type: "",
    location: "",
    description: "",
    profilePicture: "",
    posts: [],
    friends: [],
    reviews: [],
    calendar: [],
    socialLinks: [],
    map: [],
  },
};

const reducer = (
  state: loginReducerInterface = initialState,
  action: Action
): loginReducerInterface => {
  switch (action.type) {
    case ActionType.LOGIN:
      console.log("action.payload", action);

      return action.payload;
    case ActionType.ADD_POINT:
      return action.payload;

    case ActionType.LOGOUT:
      return {
        ...state,
        user: {
          name: "",
          username: undefined,
          userEmail: undefined,
          password: undefined,
          type: "",
          location: "",
          description: "",
          profilePicture: "",
          posts: [],
          friends: [],
          reviews: [],
          calendar: [],
          socialLinks: [],
          map: [],
        },
      };
    default:
      return state;
  }
};

export default reducer;
