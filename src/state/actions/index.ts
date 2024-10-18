import { ActionType } from "../action-types/index";

interface LoginInterfacrReducer {
  type: ActionType.LOGIN;
  payload: any;
}

interface GetUsersInterfaceReducer {
  type: ActionType.GET_USERS;
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

interface DeleteUserInterfaceReducer {
  type: ActionType.DELETE_USER;
  payload: any;
}

interface ResetPasswordInterfaceReducer {
  type: ActionType.RESET_PASSWORD;
  payload: any;
}
interface NewsReducerInterface {
  type: ActionType.GET_NEWS;
  payload: any;
}

interface PostNewsReducerInterface {
  type: ActionType.POST_NEWS;
  payload: any;
}

interface PostNewsImageReducerInterface {
  type: ActionType.POST_IMAGE;
  payload: any;
}

interface GetAdvertiserInterfaceReducer {
  type: ActionType.GET_ADVERTISER;
  payload: any;
}
interface GetAdvertiserReportInterfaceReducer {
  type: ActionType.GET_ADVERTISER_REPORT;
  payload: any;
}
interface GetAdvertiserContactsInterfaceReducer {
  type: ActionType.GET_ADVERTISER_CONTACTS;
  payload: any;
}

interface InsertAdvertiserInterfaceReducer {
  type: ActionType.INSERT_ADVERTISER;
  payload: any;
}

interface LogoutInterfaceReducer {
  type: ActionType.LOGOUT;
  payload: any;
}

interface GetPublisherInterfaceReducer {
  type: ActionType.GET_PUBLISER;
  payload: any;
}

interface GetPublisherReportInterfaceReducer {
  type: ActionType.GET_PUBLISHER_REPORT;
  payload: any;
}
interface GetPublisherContactsInterfaceReducer {
  type: ActionType.GET_PUBLISHER_CONTACTS;
  payload: any;
}

interface InsertPublisherInterfaceReducer {
  type: ActionType.INSERT_PUBLIHSER;
  payload: any;
}

interface GetCampaignInterfaceReducer {
  type: ActionType.GET_CAMPAIGN;
  payload: any;
}

interface GetFiltersInterfaceReducer {
  type: ActionType.SEND_APPSFLYER;
  payload: any;
}

interface InsertCampaignInterfaceReducer {
  type: ActionType.INSERT_CAMPAIGN;
  payload: any;
}
interface DeleteCampaignInterfaceReducer {
  type: ActionType.DELETE_CAMPAIGN;
  payload: any;
}
interface GetAppInterfaceReducer {
  type: ActionType.GET_APP;
  payload: any;
}
interface UpdateAppP360nterfaceReducer {
  type: ActionType.UPDATE_APP_P360;
  payload: any;
}
interface RemoveAppP360nterfaceReducer {
  type: ActionType.REMOVE_APP_P360;
  payload: any;
}
interface GetIconsInterfaceReducer {
  type: ActionType.GET_ICONS;
  payload: any;
}
interface UpdateAppReducerInterface {
  type: ActionType.UPDATE_APP;
  payload: any;
}
interface GetAppsflyerfaceReducer {
  type: ActionType.GET_APPSFLYER;
  payload: any;
}
interface AddAppReducer {
  type: ActionType.ADD_APP;
  payload: any;
}
interface UpdateAppInfoReducer {
  type: ActionType.UPDATE_APP_INFO;
  payload: any;
}

interface SaveAppsflyerReducer {
  type: ActionType.SAVE_APPSFLYER;
  payload: any;
}

interface NavigationReducer {
  type: ActionType.NAVIGATION;
  payload: any;
}

interface ReevaluateReducer {
  type: ActionType.REEVALUATE;
  payload: any;
}

interface PresearchReducer {
  type: ActionType.PRESEARCH;
  payload: any;
}
interface InsertLogReducer {
  type: ActionType.INSERT_LOG;
  payload: any;
}
interface GetLogsReducer {
  type: ActionType.GET_LOGS;
  payload: any;
}
interface GetSettingsReducer {
  type: ActionType.GET_SETTINGS;
  payload: any;
}
interface UpdateSettingsReducer {
  type: ActionType.UPDATE_SETTINGS;
  payload: any;
}

interface PresetReducer {
  type: ActionType.PRESET;
  payload: any;
}

interface GetNetworkReducer {
  type: ActionType.GET_NETWORK;
  payload: any;
}
interface PostNetworkReducer {
  type: ActionType.POST_NETWORK;
  payload: any;
}
interface UpdateNetworkReducer {
  type: ActionType.UPDATE_NETWORK;
  payload: any;
}
interface RefreshAppsflyerReducer {
  type: ActionType.UPDATE_APPSFLYER;
  payload: any;
}
interface PostRawReducer {
  type: ActionType.POST_RAWDATA;
  payload: any;
}
interface GetRawReducer {
  type: ActionType.GET_RAWDATA;
  payload: any;
}
interface UpdatesReducer {
  type: ActionType.UPDATE;
  payload: any;
}
interface GetPasswordsReducer {
  type: ActionType.GETPASSWORDS;
  payload: any;
}
interface GetAppsflyerAccountsReducer {
  type: ActionType.GETACCOUNTS;
  payload: any;
}
interface GetLearningReducer {
  type: ActionType.GET_LEARNING;
  payload: any;
}
interface AddLearningReducer {
  type: ActionType.ADD_LEARNING;
  payload: any;
}
interface RemoveLearningReducer {
  type: ActionType.REMOVE_LEARNING;
  payload: any;
}
interface GetDashboardReducer {
  type: ActionType.GETDASHBOARD;
  payload: any;
}
interface GetCampiagnHistoryReducer {
  type: ActionType.GET_CAMPAIGN_HISTORY;
  payload: any;
}
interface GetFinanceReducer {
  payload: any;
  type: ActionType.GET_FINANCE;
}
interface UploadFinanceReducer {
  payload: any;
  type: ActionType.UPLOAD_FINANCE;
}
interface UploadFinanceDemandReducer {
  payload: any;
  type: ActionType.UPLOAD_FINANCE_DEMAND;
}
interface UploadInstructionsFinanceReducer {
  payload: any;
  type: ActionType.UPLOAD_INSTRUCTIONS_FINANCE;
}
interface UploadProofFinanceReducer {
  payload: any;
  type: ActionType.UPLOAD_PROOF_FINANCE;
}
interface DeleteProofFinanceReducer {
  payload: any;
  type: ActionType.DELETE_PROOF_FINANCE;
}
interface SendEmailFinanceReducer {
  payload: any;
  type: ActionType.SEND_EMAIL_FINANCE;
}
interface SendEmailAdvertiserFinanceReducer {
  payload: any;
  type: ActionType.SEND_EMAIL_FINANCE_ADVERTISER;
}
interface GetAutoSwitch {
  type: ActionType.GETAUTOSWITCH;
  payload: any;
}
interface PutAutoSwitch {
  type: ActionType.PUTAUTOSWITCH;
  payload: any;
}

interface DeleteAutoSwitch {
  type: ActionType.DELETEAUTOSWITCH;
  payload: any;
}

interface AvatarsReducer {
  type: ActionType.AVATAR;
  payload: any;
}

interface VersionReducer {
  type: ActionType.GETVERSION;
  payload: any;
}

export type Action =
  | LoginInterfacrReducer
  | GetUsersInterfaceReducer
  | GetAdvertiserInterfaceReducer
  | GetAdvertiserReportInterfaceReducer
  | GetAdvertiserContactsInterfaceReducer
  | LogoutInterfaceReducer
  | GetPublisherInterfaceReducer
  | InsertAdvertiserInterfaceReducer
  | InsertPublisherInterfaceReducer
  | GetCampaignInterfaceReducer
  | InsertCampaignInterfaceReducer
  | DeleteCampaignInterfaceReducer
  | GetAppsflyerfaceReducer
  | InsertUserInterfaceReducer
  | GetAppInterfaceReducer
  | GetIconsInterfaceReducer
  | ResetPasswordInterfaceReducer
  | GetFiltersInterfaceReducer
  | UpdateAppReducerInterface
  | UpdateAppP360nterfaceReducer
  | RemoveAppP360nterfaceReducer
  | DeleteUserInterfaceReducer
  | NewsReducerInterface
  | AddAppReducer
  | UpdateAppInfoReducer
  | SaveAppsflyerReducer
  | NavigationReducer
  | ReevaluateReducer
  | PresearchReducer
  | InsertLogReducer
  | GetLogsReducer
  | GetSettingsReducer
  | UpdateSettingsReducer
  | PresetReducer
  | PostNewsReducerInterface
  | PostNewsImageReducerInterface
  | GetNetworkReducer
  | PostNetworkReducer
  | RefreshAppsflyerReducer
  | UpdateNetworkReducer
  | PostRawReducer
  | GetRawReducer
  | UpdatesReducer
  | GetPublisherReportInterfaceReducer
  | GetPublisherContactsInterfaceReducer
  | GetPasswordsReducer
  | GetLearningReducer
  | AddLearningReducer
  | RemoveLearningReducer
  | GetDashboardReducer
  | GetAutoSwitch
  | PutAutoSwitch
  | DeleteAutoSwitch
  | GetAppsflyerAccountsReducer
  | GetCampiagnHistoryReducer
  | GetFinanceReducer
  | AvatarsReducer
  | UploadFinanceReducer
  | UploadFinanceDemandReducer
  | SendEmailFinanceReducer
  | SendEmailAdvertiserFinanceReducer
  | UploadInstructionsFinanceReducer
  | UploadProofFinanceReducer
  | DeleteProofFinanceReducer
  | VersionReducer
  | AddPointInterfaceReducer;
