export enum ActionType {
  LOGIN = "login",
  GET_USERS = "get_users",
  LOGOUT = "logout",
  UPDATE_USER = "updateuser",
  UPDATE_CHAT = "update_chat",
  USER = "user",
  SET_SESSION_VALIDITY = "user/setSessionValidity",

  SET_USER_DATA = "user/setUserData",

  NOTIFY = "notify",
  ADD_NOTIFICATION = "notify/addNotification",
  REMOVE_NOTIFICATION = "notify/removeNotification",

  LIVESTREAMS = "livestreams",
  LIVESTREAMCREATE = "livestreams/createStream",

  DEVICE = "device",
  SET_CURRENT_BREAKPOINT = "device/setCurrentBreakpoint",
  TOGGLE_PROFILE_MENU = "device/toggleProfileMenu",
  ADD_MOBILE_OVERLAY = "device/addMobileOverlay",
  REMOVE_MOBILE_OVERLAY = "device/removeMobileOverlay",

  CHAT = "chat",
  INIT_MESSAGES = "chat/init_messages",
  ADD_MESSAGE = "chat/add_message",
  DELETE_MESSAGE = "chat/delete_message",
  DELETE_MESSAGES_BY_USER_ID = "chat/delete_messages_by_user_id",
  SET_CONNECTION_STATE = "chat/set_connection_state",
  SET_CHAT_CAPABILITIES = "chat/set_chat_capabilities",

  OPEN_MODAL = "open_modal",
  CLOSE_MODAL = "close_modal",
  SET_MODAL_OPEN_STATE = "set_modal_open_state",
  SET_MODAL_CONFIRM = "set_modal_confirm",

  GETPROFILEDATA = "profile",
  PROFILEDATA_U = "profile/update",
  ADD_POINT = "ADD_POINT",
  INSERT_USER = "INSERT_USER",

  NEWS = "news/get",
  GETPOSTS = "news/getPosts",
  MAKEEVENT = "news/makeEvent",
}
