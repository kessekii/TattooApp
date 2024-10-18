// redux/reducers/chatReducer.js
import { ActionType } from '../action-types/index';

const initialState = {
  messages: [],
  chatCapabilities: [],
  isConnecting: false,
  hasConnectionError: false,
};

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.INIT_MESSAGES:
      return { ...state, messages: action.payload };

     


    default:
      throw new Error('Unexpected action type');
  }
};

export default chatReducer;