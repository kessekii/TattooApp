import { ActionType } from '../action-types/index';

const initialState = {
  isSessionValid: false,
  userData: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    
    case ActionType.SET_SESSION_VALIDITY:
      return {
        ...state,
        isSessionValid: action.payload,
      };

    case ActionType.SET_USER_DATA:
      return {
        ...state,
        userData: action.payload,
      };

    default:
      return state;
  }
};

export default userReducer;