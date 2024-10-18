import { ActionType } from "../action-types/index";

interface LoginInterfacrReducer {
  type: ActionType.LOGIN;
  payload: any;
}

interface LogoutInterfaceReducer {
  type: ActionType.LOGOUT;
}

interface LivestreamInterfaceReducer {
  type: ActionType.LIVESTREAMS;
  payload: any;
}

interface LivestreamCreateInterfaceReducer {
  type: ActionType.LIVESTREAMCREATE;
  payload: any;
}

interface DeviceInterfaceReducer {
  type: ActionType.DEVICE;
  payload: any;
}

interface ChatInterfaceReducer {
  type: ActionType.CHAT;
  payload: any;
}

interface ChatInitMessagesInterfaceReducer {
  type: ActionType.INIT_MESSAGES;
  payload: any;
}

interface ChatAddMessageInterfaceReducer {
  type: ActionType.ADD_MESSAGE;
  payload: any;
}

interface ChatDeleteMessageInterfaceReducer {
  type: ActionType.DELETE_MESSAGE;
  payload: any;
}

interface ChatDeleteMessagesByUserIdInterfaceReducer {
  type: ActionType.DELETE_MESSAGES_BY_USER_ID;
  payload: any;
}

interface ChatSetConnectionStateInterfaceReducer {
  type: ActionType.SET_CONNECTION_STATE;
  payload: any;
}

interface ChatSetChatCapabilitiesInterfaceReducer {
  type: ActionType.SET_CHAT_CAPABILITIES;
  payload: any;
}

interface UserInterfaceReducer {
  type: ActionType.USER;
  payload: any;
}

interface NotifyAddInterfaceReducer {
  type: ActionType.ADD_NOTIFICATION;
  payload: any;
}

interface NotifyRemoveInterfaceReducer {
  type: ActionType.REMOVE_NOTIFICATION;
  payload: any;
}
interface AddPointInterfaceReducer {
  type: ActionType.ADD_POINT;
  payload: any;
}
interface InsertUserInterfaceReducer {
  type: ActionType.INSERT_USER;
  payload: any;
}
interface ProfileDataInterfaceReducer {
  type: ActionType.GETPROFILEDATA;
  payload: any;
}

export type Action =
  | LoginInterfacrReducer
  | LogoutInterfaceReducer
  | UserInterfaceReducer
  | LivestreamInterfaceReducer
  | LivestreamCreateInterfaceReducer
  | DeviceInterfaceReducer
  | ChatInterfaceReducer
  | ChatInitMessagesInterfaceReducer
  | ChatAddMessageInterfaceReducer
  | ChatDeleteMessageInterfaceReducer
  | ChatDeleteMessagesByUserIdInterfaceReducer
  | ChatSetConnectionStateInterfaceReducer
  | ChatSetChatCapabilitiesInterfaceReducer
  | NotifyAddInterfaceReducer
  | NotifyRemoveInterfaceReducer
  | ProfileDataInterfaceReducer
  | AddPointInterfaceReducer
  | InsertUserInterfaceReducer;
