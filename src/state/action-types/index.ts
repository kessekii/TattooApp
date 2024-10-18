export enum ActionType {
  LOGIN = "login",
  GET_USERS = "get_users",
  LOGOUT = "logout",
  ADD_POINT = "addPoint",
  GET_NEWS = "get_news",
  POST_NEWS = "post_news",
  POST_IMAGE = "post_image",

  INSERT_LOG = "insert_log",
  GET_LOGS = "get_logs",

  GET_SETTINGS = "get_settings",
  UPDATE_SETTINGS = "update_settings",

  INSERT_USER = "insert_user",
  RESET_PASSWORD = "reset_password",
  DELETE_USER = "delete_user",
  EDIT_USER = "edit_user",

  GET_ADVERTISER = "get_advertiser",
  INSERT_ADVERTISER = "insert_advertiser",
  GET_ADVERTISER_REPORT = "get_advertiser_report",
  GET_ADVERTISER_CONTACTS = "get_advertiser_contacts",

  GET_PUBLISER = "publisher",
  INSERT_PUBLIHSER = "insert_publisher",
  DELETE_PUBLISHER = "delete_publisher",
  GET_PUBLISHER_REPORT = "get_publisher_report",
  GET_PUBLISHER_CONTACTS = "get_publisher_contacts",

  GET_CAMPAIGN = "get_campaign",
  INSERT_CAMPAIGN = "insert_campaign",
  DELETE_CAMPAIGN = "delete_campaign",

  GET_APPSFLYER = "get_appsflyer",
  UPDATE_APPSFLYER = "update_appsflyer",
  SAVE_APPSFLYER = "upload_report",
  SEND_APPSFLYER = "send_appsflyer",

  GET_APP = "get_app",
  GET_ICONS = "get_icons",
  ADD_APP = "add_app",
  UPDATE_APP_P360 = "update_app_p360",
  REMOVE_APP_P360 = "remove_app_p360",
  UPDATE_APP_INFO = "update_app_info",
  UPDATE_APP = "update_app",

  NAVIGATION = "navigation",

  PRESEARCH = "presearch",

  REEVALUATE = "reevaluate",
  PRESET = "preset",

  POST_NETWORK = "post_network",
  GET_NETWORK = "get_network",
  UPDATE_NETWORK = "update_network",

  GET_RAWDATA = "get_rawdata",
  POST_RAWDATA = "post_rawdata",

  UPDATE = "update",

  GETPASSWORDS = "get_passwords",
  //appsflyer accounts:
  GETACCOUNTS = "get_appsflyer_accounts",
  //learning:
  GET_LEARNING = "get_learning",
  ADD_LEARNING = "add_learning",
  REMOVE_LEARNING = "remove_learning",
  //finance
  GET_FINANCE = "get_finance",
  UPLOAD_FINANCE = "upload_finance",
  UPLOAD_FINANCE_DEMAND = "upload_finance_demand",
  UPLOAD_INSTRUCTIONS_FINANCE = "upload_instructions_finance",
  UPLOAD_PROOF_FINANCE = "upload_proof_finance",
  DELETE_PROOF_FINANCE = "delete_proof_finance",
  SEND_EMAIL_FINANCE = "send_email_finance",
  SEND_EMAIL_FINANCE_ADVERTISER = "send_email_finance_advertiser",

  GETDASHBOARD = "get_dashboard",
  GET_CAMPAIGN_HISTORY = "get_campaign_history",

  GETAUTOSWITCH = "get_autoswitch",
  PUTAUTOSWITCH = "put_autoswitch",
  DELETEAUTOSWITCH = "delete_autoswitch",
  AVATAR = "avatar",

  GETVERSION = "getversion",
}
