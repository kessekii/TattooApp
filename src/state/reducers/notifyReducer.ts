import { ActionType } from '../action-types/index';

const initialState: NotificationState = {
    notification: null
};

  
interface Notification {
    message: string;
    type: 'success' | 'error' | 'info';
    timeout: number;
    asPortal: boolean;
    withTimeout: boolean;
  }
  
  export interface NotificationState {
    notification: Notification | null;
  }

const notifyReducer = (state = initialState, action) => {
  switch (action.type) {
    
    case ActionType.ADD_NOTIFICATION:
      return {
        
        notification: action.payload,
      };

    case ActionType.REMOVE_NOTIFICATION:
      return {
        
        notification: null,
      };

    default:
      return state;
  }
};

export default notifyReducer;