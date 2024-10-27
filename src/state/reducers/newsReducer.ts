import { NewsInterface } from "src/models/model.interface";
import { ActionType } from "../action-types/index";
import { Action } from "../actions";

interface NewsItem {
  name: string;
  username: string;
  title: string;
  image: string;
  time: string;
  due: string;

  views: number;
  likes: number;
  comments: Array<{ author: string; text: string }>;
  shares: number;
}

interface loginReducerInterface {
  news: NewsItem[];
}

const initialState: loginReducerInterface = {
  news: [
    {
      name: "",
      username: "",
      title: "",
      image: "",
      time: "",
      due: "",

      views: 0,
      likes: 0,
      comments: [{ author: "", text: "" }],
      shares: 0,
    },
  ],
};

const newsReducer = (
  state: loginReducerInterface = initialState,
  action: Action
): loginReducerInterface => {
  switch (action.type) {
    case ActionType.NEWS:
      return action.payload;

    case ActionType.MAKEEVENT:
      return action.payload;

    default:
      return state;
  }
};

export default newsReducer;
