import { set, subDays } from "date-fns";
import { Dispatch } from "redux";
import { CLIENT_VERSION, endpoints } from "../../config";
import {
  PublisherInterface,
  UserInterface,
} from "../../models/model.interface";
import AxiosCustom from "../../utils/Axios";

import { ActionType } from "../action-types";
import { Action } from "../actions/index";

export interface loginParams {
  userEmail: string;
  password: string;
}

export interface newPasswordParams {
  email: string;
  newPassword: string;
}

export interface userParams {
  Authorization: string;
}

export interface updateAppParams {
  app_id: string;
  status: boolean;
  email: string;
  created_by: string;
}
//------------NEWS OPERATIONS ------------

export const getNewsAction = (headers: any) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      const { data } = await AxiosCustom.get(endpoints.NEWS, {
        headers,
      });
      if (!data.successful) {
        return;
      }

      dispatch({
        type: ActionType.GET_NEWS,
        payload: data.payload,
      });
    } catch (err) {
      console.error(err);
      window.location.replace(window.location.origin);
    }
  };
};

export const postNewsAction = (headers: any, obj: any) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      const payload = {
        post: {
          id: 1,
          topics: obj.topics,
          deleted: obj.deleted,
        },
      };
      const { data } = await AxiosCustom.post(endpoints.NEWS, payload, {
        headers,
      });
      if (!data.successful) {
        return;
      }

      dispatch({
        type: ActionType.POST_NEWS,
        payload: data.payload,
      });
    } catch (err) {
      console.error(err);
    }
  };
};

export const postNewsImageAction = (headers: any, payload: any) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      function base64Encode(str: any) {
        var CHARS =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var out = "",
          i = 0,
          len = str.length,
          c1,
          c2,
          c3;
        while (i < len) {
          c1 = str.charCodeAt(i++) & 0xff;
          if (i == len) {
            out += CHARS.charAt(c1 >> 2);
            out += CHARS.charAt((c1 & 0x3) << 4);
            out += "==";
            break;
          }
          c2 = str.charCodeAt(i++);
          if (i == len) {
            out += CHARS.charAt(c1 >> 2);
            out += CHARS.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4));
            out += CHARS.charAt((c2 & 0xf) << 2);
            out += "=";
            break;
          }
          c3 = str.charCodeAt(i++);
          out += CHARS.charAt(c1 >> 2);
          out += CHARS.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4));
          out += CHARS.charAt(((c2 & 0xf) << 2) | ((c3 & 0xc0) >> 6));
          out += CHARS.charAt(c3 & 0x3f);
        }
        return out;
      }
      const obj = { post: payload };
      const { data } = await AxiosCustom.post(
        endpoints.NEWS_I,
        JSON.stringify(obj),
        {
          headers,
        }
      );
      if (!data.successful) {
        return;
      }
      dispatch({
        type: ActionType.POST_IMAGE,
        payload: data.payload,
      });
    } catch (err) {
      console.error(err);
    }
  };
};

// --------- LOGS OPERATION --------

export const getLogsAction = (headers: any) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      const { data } = await AxiosCustom.get(endpoints.LOGS, {
        headers,
      });
      if (!data.successful) {
        return;
      }

      dispatch({
        type: ActionType.GET_LOGS,
        payload: data.payload,
      });
    } catch (err) {
      console.error(err);
    }
  };
};

export const getLogsByDateAction = (
  headers: any,
  from_date: Date,
  to_date: Date
) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      const payload = { logs: { from_date, to_date } };
      const { data } = await AxiosCustom.post(endpoints.LOGS, payload, {
        headers,
      });

      if (!data.successful) {
        return;
      }

      dispatch({
        type: ActionType.GET_LOGS,
        payload: data.payload,
      });
    } catch (err) {
      console.error(err);
    }
  };
};

export const insertLog = (headers: any, obj: any) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      const log = {
        log: obj,
      };
      const { data } = await AxiosCustom.post(endpoints.LOGS + "/add", log, {
        headers,
      });

      if (!data.successful) {
        return;
      }
      dispatch({
        type: ActionType.INSERT_LOG,
        payload: data.payload,
      });
    } catch (err) {
      console.error(err);
    }
  };
};

// --------- LEARNING OPERATION --------

export const getLearningAction = (headers: any) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      const { data } = await AxiosCustom.get(endpoints.DOCUMENTS, {
        headers,
      });
      // const learning = {
      // 	allowedPlatforms: JSON.parse(data.payload[0].allowedPlatforms),
      // 	vertical: JSON.parse(data.payload[0].vertical),
      // 	capabilities: JSON.parse(data.payload[0].capabilities),
      // 	salesRepresentative: JSON.parse(data.payload[0].salesRepresentative),
      // 	platforms: JSON.parse(data.payload[0].platforms),
      // 	contactRole: JSON.parse(data.payload[0].contactRole),
      // }
      if (!data.successful) {
        return;
      }

      dispatch({
        type: ActionType.GET_LEARNING,
        payload: data.payload,
      });
    } catch (err) {
      console.error(err);
    }
  };
};
export const addLearningRow = (
  headers: any,
  obj: any,
  setErrorMessage: any,
  setIsSuccessPromptOpened: any,
  setLoading: any
) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      const learning = {
        learning: obj,
      };
      const { data } = await AxiosCustom.post(endpoints.DOCUMENTS, learning, {
        headers,
      });
      if (!data.successful) {
        setErrorMessage(data.payload);
        setLoading(false);
        return;
      }
      setIsSuccessPromptOpened(true);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };
};
export const updateLearningRow = (
  headers: any,
  obj: any,
  setErrorMessage: any,
  setIsSuccessPromptOpened: any,
  setLoading: any
) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      const learning = {
        learning: obj,
      };
      const { data } = await AxiosCustom.put(endpoints.DOCUMENTS, learning, {
        headers,
      });
      if (!data.successful) {
        setErrorMessage(data.payload);
        setLoading(false);
        return;
      }
      setIsSuccessPromptOpened(true);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };
};
export const removeRow = (
  headers: any,
  obj: any,
  setErrorMessage: any,
  setIsSuccessPromptOpened: any
) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      const dataSend = { learning: obj };

      const { data } = await AxiosCustom.delete(
        endpoints.DOCUMENTS + `/${obj.id}`,
        {
          headers,
          data: dataSend,
        }
      );
      if (!data.successful) {
        setErrorMessage(data.payload);
        return;
      }
      setIsSuccessPromptOpened(true);
      dispatch({
        type: ActionType.REMOVE_LEARNING,
        payload: obj,
      });
    } catch (err) {
      console.error(err);
    }
  };
};
// --------- SETTINGS OPERATION --------

export const getSettingsAction = (headers: any) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      const { data } = await AxiosCustom.get(endpoints.SETTINGS, {
        headers,
      });
      const settings = {
        allowedPlatforms: data.payload[0].allowedPlatforms
          ? JSON.parse(data.payload[0].allowedPlatforms)
          : [],
        vertical: data.payload[0].vertical
          ? JSON.parse(data.payload[0].vertical)
          : [],
        capabilities: data.payload[0].capabilities
          ? JSON.parse(data.payload[0].capabilities)
          : [],
        salesRepresentative: data.payload[0].salesRepresentative
          ? JSON.parse(data.payload[0].salesRepresentative)
          : [],
        teams: data.payload[0].teams ? JSON.parse(data.payload[0].teams) : [],
        fraudTools: data.payload[0].fraudTools
          ? JSON.parse(data.payload[0].fraudTools)
          : [],
        platforms: data.payload[0].platforms
          ? JSON.parse(data.payload[0].platforms)
          : [],
        contactRole: data.payload[0].contactRole
          ? JSON.parse(data.payload[0].contactRole)
          : [],
        banners: data.payload[0].banners
          ? JSON.parse(data.payload[0].banners)
          : [],
        videos: data.payload[0].videos
          ? JSON.parse(data.payload[0].videos)
          : [],
        paymentTerms: data.payload[0].paymentTerms
          ? JSON.parse(data.payload[0].paymentTerms)
          : [],
        pauseReason: data.payload[0].pauseReason
          ? JSON.parse(data.payload[0].pauseReason)
          : [],
        trafficRestrictions: data.payload[0].trafficRestrictions
          ? JSON.parse(data.payload[0].trafficRestrictions)
          : [],
        existingChannels: data.payload[0].existingChannels
          ? JSON.parse(data.payload[0].existingChannels)
          : [],
        communicationChannel: data.payload[0].communicationChannel
          ? JSON.parse(data.payload[0].communicationChannel)
          : [],

        targetAudience: data.payload[0].targetAudience
          ? JSON.parse(data.payload[0].targetAudience)
          : [],
        targetAudienceOthers: data.payload[0].targetAudienceOthers
          ? JSON.parse(data.payload[0].targetAudienceOthers)
          : [],
        campaignGoals: data.payload[0].campaignGoals
          ? JSON.parse(data.payload[0].campaignGoals)
          : [],
        currency: data.payload[0].currency
          ? JSON.parse(data.payload[0].currency)
          : [],
        paymentMethod: data.payload[0].paymentMethod
          ? JSON.parse(data.payload[0].paymentMethod)
          : [],
        branches: data.payload[0].branches
          ? JSON.parse(data.payload[0].branches)
          : [],
        vatValues: data.payload[0].vatValues
          ? JSON.parse(data.payload[0].vatValues)
          : [],
      };
      if (!data.successful) {
        return;
      }

      dispatch({
        type: ActionType.GET_SETTINGS,
        payload: settings,
      });
    } catch (err) {
      console.error(err);
    }
  };
};
export const updateSettings = (
  headers: any,
  obj: any,
  setErrorMessage: any
) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      const settings = {
        settings: obj,
      };
      const { data } = await AxiosCustom.post(endpoints.SETTINGS, settings, {
        headers,
      });
      if (!data.successful) {
        setErrorMessage(data);
        return;
      }
      dispatch({
        type: ActionType.UPDATE_SETTINGS,
        payload: data.payload,
      });
    } catch (err) {
      console.error(err);
    }
  };
};
// --------- USERS OPERATION --------
export const loginAction = (loginParams: any, setErrorMessage: any) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      const headers = {
        Authorization: "Bearer " + "AIzaSyC3zvtXPRpuYYTKEJsZ6WXync_-shMPkHM",
      };

      const { data } = await AxiosCustom.post("/users/login", loginParams, {
        headers,
      });
      loginParams.setUser(data.payload);
      dispatch({
        type: ActionType.LOGIN,
        payload: data.payload,
      });
      if (!data.successful) {
        setErrorMessage(data.payload);
        return data.payload;
      }
      data.payload.user.name = data.payload.user.name;
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  };
};

export const logOutAction = (props: { setUser: any }) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      props.setUser({});
      dispatch({
        type: ActionType.LOGOUT,
        payload: {},
      });
    } catch (err) {
      console.error(err);
    }
  };
};

export const usersAction = (headers: any) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      let { data } = await AxiosCustom.get(endpoints.USER, {
        headers,
      });
      if (!data.successful) {
        return;
      }

      data.payload.forEach((user: UserInterface) => {
        user.name = user.name;
      });
      dispatch({
        type: ActionType.GET_USERS,
        payload: data.payload,
      });
    } catch (err) {
      console.error(err);
    }
  };
};

export const forgotPasswordAction = (email: string, setCodeHash: any) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      const emailobj = { mail: email };
      let { data } = await AxiosCustom.post(endpoints.FORGOTPASSWORD, emailobj);
      if (!data.successful) {
        return data.payload;
      }
      setCodeHash(data.payload);
      // dispatch({
      // 	type: ActionType.GET_USERS,
      // 	payload: data.payload,
      // })
    } catch (err) {
      console.error(err);
    }
  };
};
export const showPasswordAction = (
  headers: any,
  email: string,
  setCodeHash: any
) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      const emailobj = { mail: email };
      let { data } = await AxiosCustom.post(endpoints.SHOW_PASSWORD, emailobj, {
        headers,
      });
      if (!data.successful) {
        return;
      }
      setCodeHash(data.payload);
      // dispatch({
      // 	type: ActionType.GET_USERS,
      // 	payload: data.payload,
      // })
    } catch (err) {
      console.error(err);
    }
  };
};

export const insertUser = (user: any, setErrorMessage: any) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      const headers = {
        Authorization: "Bearer " + "AIzaSyC3zvtXPRpuYYTKEJsZ6WXync_-shMPkHM",
      };
      const { data } = await AxiosCustom.post(endpoints.REGISTER, user, {
        headers,
      });

      if (!data.successful) {
        setErrorMessage(data.payload);
        return;
      }
      dispatch({
        type: ActionType.INSERT_USER,
        payload: user,
      });
    } catch (err) {
      setErrorMessage(err);
      console.error(err);
    }
  };
};

export const editUser = (headers: any, obj: any, setErrorMessage: any) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      const user = { user: obj };
      const { data } = await AxiosCustom.put(endpoints.USER, user, {
        headers,
      });

      if (!data.successful) {
        setErrorMessage(data.payload);
        return;
      }
      // dispatch({
      // 	type: ActionType.EDIT_USER,
      // 	payload: obj,
      // })
    } catch (err) {
      setErrorMessage(err);
      console.error(err);
    }
  };
};
export const addPoint = (user: any, setErrorMessage: any) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      const headers = {
        Authorization: "Bearer " + "AIzaSyC3zvtXPRpuYYTKEJsZ6WXync_-shMPkHM",
      };

      const { data } = await AxiosCustom.post(endpoints.ADD_POINT, user, {
        headers,
      });

      if (!data.successful) {
        setErrorMessage(data.payload);
        return;
      }

      dispatch({
        type: ActionType.ADD_POINT,
        payload: data.payload,
      });
    } catch (err) {
      setErrorMessage(err);
      console.error(err);
    }
  };
};
export const deleteUser = (headers: any, obj: any, setErrorMessage: any) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      const { data } = await AxiosCustom.delete(endpoints.USER, {
        headers,
        data: {
          user: obj,
        },
      });

      if (!data.successful) {
        setErrorMessage(data.payload);
        return;
      }
      dispatch({
        type: ActionType.DELETE_USER,
        payload: obj,
      });
    } catch (err) {
      setErrorMessage(err);
      console.error(err);
    }
  };
};

export const resetPassword = (
  headers: any,
  obj: newPasswordParams,
  setErrorMessage: any
) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      const user = { user: obj };
      const { data } = await AxiosCustom.post(endpoints.PASSWORD, user, {
        headers,
      });

      if (!data.successful) {
        setErrorMessage(data.payload);
        return;
      }
      dispatch({
        type: ActionType.RESET_PASSWORD,
        payload: obj,
      });
    } catch (err) {
      setErrorMessage(err);
      console.error(err);
    }
  };
};
// ------- APPS OPERATIONS--------
export const getAppsAction = (headers: any) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      const { data } = await AxiosCustom.get(endpoints.APP, {
        headers,
      });
      if (!data.successful) {
        return;
      }
      dispatch({
        type: ActionType.GET_APP,
        payload: data.payload,
      });
    } catch (err) {
      console.error(err);
      // if (
      // 	window.location.pathname !== '/notlogged' &&
      // 	window.location.pathname !== '/'
      // ) {
      // 	window.location.replace(window.location.origin + '/notlogged')
      // }
    }
  };
};
export const getAppsIcons = (headers: any) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      const { data } = await AxiosCustom.get(endpoints.ICONS, {
        headers,
      });
      if (!data.successful) {
        return;
      }
      dispatch({
        type: ActionType.GET_ICONS,
        payload: data.payload,
      });
    } catch (err) {
      console.error(err);
      // if (
      // 	window.location.pathname !== '/notlogged' &&
      // 	window.location.pathname !== '/'
      // ) {
      // 	window.location.replace(window.location.origin + '/notlogged')
      // }
    }
  };
};

export const updateAppP360 = (
  headers: any,
  obj: any,
  setErrorMessage: any,
  setSucessMessage: any
) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      const app = { app: obj };
      const { data } = await AxiosCustom.post(endpoints.P360APP, app, {
        headers,
      });
      if (data.payload.successful === false) {
        setErrorMessage(data.payload.payload);
        return data.payload.payload;
      }
      setSucessMessage(true);
      dispatch({
        type: ActionType.UPDATE_APP_P360,
        payload: app,
      });
      return;
    } catch (err) {
      setErrorMessage(err);
      console.error(err);
    }
  };
};
export const removeAppP360 = (
  headers: any,
  obj: any,
  setErrorMessage: any,
  setSucessMessage: any
) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      const app = { app: obj };
      const { data } = await AxiosCustom.post(endpoints.REMOVEP360APP, app, {
        headers,
      });
      if (data.payload.successful === false) {
        setErrorMessage(data.payload.payload);
        return data.payload;
      }
      setSucessMessage(true);
      dispatch({
        type: ActionType.REMOVE_APP_P360,
        payload: app,
      });
      return;
    } catch (err) {
      setErrorMessage(err);
      console.error(err);
    }
  };
};
export const insertApp = (headers: any, obj: any, setErrorMessage: any) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      const app = { app: obj };
      const { data } = await AxiosCustom.post(endpoints.APP, app, {
        headers,
      });

      if (!data.successful) {
        setErrorMessage(data.payload);
        return;
      }
      dispatch({
        type: ActionType.ADD_APP,
        payload: obj,
      });
    } catch (err) {
      setErrorMessage(err);
      console.error(err);
    }
  };
};
export const updateAppInfo = (headers: any, obj: any, setErrorMessage: any) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      const app = { app: obj };
      const { data } = await AxiosCustom.post(endpoints.APPUPDATE, app, {
        headers,
      });

      if (!data.successful) {
        setErrorMessage(data.payload);
        return;
      }
      dispatch({
        type: ActionType.UPDATE_APP_INFO,
        payload: obj,
      });
    } catch (err) {
      setErrorMessage(err);
      console.error(err);
    }
  };
};

export const updateAppsAction = (
  headers: any,
  obj: updateAppParams,
  row: any,
  setErrorMessage: any
) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      const app = { app: obj };
      const { data } = await AxiosCustom.put(endpoints.APP, app, {
        headers,
      });
      if (!data.successful) {
        setErrorMessage(data.payload);
        return;
      }
      row.status = !row.status;

      dispatch({
        type: ActionType.UPDATE_APP,
        payload: row,
      });
    } catch (err) {
      setErrorMessage(err);
      console.error(err);
    }
  };
};
// ------- ADVERTISER OPERATIONS--------

export const getAdvertiserAction = (headers: any) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      const { data } = await AxiosCustom.get(endpoints.ADVERTISER, {
        headers,
      });
      if (!data.successful) {
        return;
      }
      dispatch({
        type: ActionType.GET_ADVERTISER,
        payload: data.payload,
      });
    } catch (err) {
      console.error(err);
      // if (
      // 	window.location.pathname !== '/notlogged' &&
      // 	window.location.pathname !== '/'
      // ) {
      // 	window.location.replace(window.location.origin + '/notlogged')
      // }
    }
  };
};

export const getAdvertiserReport = (
  setDownloadFile: any,
  rows: any,
  headers: any
) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      const report = { report: rows };
      const { data } = await AxiosCustom.post(
        endpoints.ADVERTISER + "/report",
        report,
        {
          headers,
        }
      );
      if (!data.successful) {
        return;
      }
      // dispatch({
      // 	type: ActionType.GET_ADVERTISER_REPORT,
      // 	payload: data.payload,
      // })
      setDownloadFile(data.payload);
    } catch (err) {
      console.error(err);
    }
  };
};
export const getAdvertiserContacts = (setDownloadFile: any, headers: any) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      const { data } = await AxiosCustom.get(
        endpoints.ADVERTISER + "/contacts",
        {
          headers,
        }
      );
      if (!data.successful) {
        return;
      }
      // dispatch({
      // 	type: ActionType.GET_ADVERTISER_CONTACTS,
      // 	payload: data.payload,
      // })
      setDownloadFile(data.payload);
    } catch (err) {
      console.error(err);
    }
  };
};

export const insertAdvertiserAction = (
  headers: any,
  obj: any,
  setErrorMessage: any
) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      const advertiser = { advertiser: obj };
      const { data } = await AxiosCustom.post(
        endpoints.ADVERTISER,
        advertiser,
        {
          headers,
        }
      );

      if (!data.successful) {
        setErrorMessage(data.payload);
        return data.payload;
      }
      // const newObj = {
      // 	advertiser_name: obj.advertiser_name,
      // 	email: obj.ownerEmail,
      // 	status: obj.status,
      // 	platforms: obj.platform,
      // 	app: obj.campaigns,
      // }

      dispatch({
        type: ActionType.INSERT_ADVERTISER,
        payload: obj,
      });
    } catch (err) {
      setErrorMessage(err);
    }
  };
};

export const updateAdvertiserAction = (
  headers: any,
  obj: any,
  setErrorMessage: any
) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      const advertiser = { advertiser: obj };
      const { data } = await AxiosCustom.put(endpoints.ADVERTISER, advertiser, {
        headers,
      });

      if (!data.successful) {
        setErrorMessage(data.payload);

        return data.payload;
      }
      // const newObj = {
      // 	advertiser_name: obj.advertiser_name,
      // 	email: obj.ownerEmail,
      // 	status: obj.status,
      // 	platforms: obj.platform,
      // 	app: obj.campaigns,
      // }

      dispatch({
        type: ActionType.INSERT_ADVERTISER,
        payload: obj,
      });
    } catch (err) {
      setErrorMessage(err);
    }
  };
};
export const deleteAdvertiser = (
  headers: any,
  obj: any,
  setErrorMessage: any
) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      const { data } = await AxiosCustom.delete(endpoints.ADVERTISER, {
        headers,
        data: {
          advertiser: obj,
        },
      });
      if (!data.successful) {
        setErrorMessage(data.payload);
        return data.payload;
      }

      // dispatch({
      // 	type: ActionType.DELETE_PUBLISHER,
      // 	payload: obj,
      // })
    } catch (err) {
      setErrorMessage(err);
      console.error(err);
    }
  };
};
// ------- PUBLISHER OPERATIONS--------

export const getPublisherAction = (headers: any) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      const { data } = await AxiosCustom.get(endpoints.PUBLISHER, {
        headers,
      });
      if (!data.successful) {
        return;
      }
      for (const element of data.payload) {
        if (element.media_buying_capabilities) {
          element.media_buying_capabilities = JSON.parse(
            element.media_buying_capabilities
          );
        }
      }
      dispatch({
        type: ActionType.GET_PUBLISER,
        payload: data.payload,
      });
    } catch (err) {
      console.error(err);
      // if (
      // 	window.location.pathname !== '/notlogged' &&
      // 	window.location.pathname !== '/'
      // ) {
      // 	window.location.replace(window.location.origin + '/notlogged')
      // }
    }
  };
};

export const insertPublisherAction = (
  headers: any,
  obj: PublisherInterface,
  setErrorMessage: any
) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      const publisher = { publisher: obj };
      const { data } = await AxiosCustom.post(endpoints.PUBLISHER, publisher, {
        headers,
      });
      if (!data.successful) {
        setErrorMessage(data.payload);
        return data.payload;
      }

      dispatch({
        type: ActionType.INSERT_PUBLIHSER,
        payload: obj,
      });
    } catch (err) {
      setErrorMessage(err);
      console.error(err);
    }
  };
};

export const getPublisherReport = (
  setDownloadFile: any,
  rows: any,
  skypeGroupUserAllowed: boolean,
  headers: any
) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      const publisher = {
        publisher: {
          skype_private_allowed: skypeGroupUserAllowed,
          report: rows,
        },
      };
      const { data } = await AxiosCustom.post(
        endpoints.PUBLISHER + "/report",
        publisher,
        {
          headers,
        }
      );
      if (!data.successful) {
        return;
      }
      dispatch({
        type: ActionType.GET_PUBLISHER_REPORT,
        payload: data.payload,
      });
      setDownloadFile(data.payload);
    } catch (err) {
      console.error(err);
    }
  };
};
export const getPublisherContacts = (setDownloadFile: any, headers: any) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      const { data } = await AxiosCustom.get(
        endpoints.PUBLISHER + "/contacts",
        {
          headers,
        }
      );
      if (!data.successful) {
        return;
      }
      dispatch({
        type: ActionType.GET_PUBLISHER_CONTACTS,
        payload: data.payload,
      });
      setDownloadFile(data.payload);
    } catch (err) {
      console.error(err);
    }
  };
};

export const updatePublisherAction = (
  headers: any,
  obj: PublisherInterface,
  setErrorMessage: any
) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      const objCopy = { ...obj };
      const publisher = { publisher: obj };
      const { data } = await AxiosCustom.put(endpoints.PUBLISHER, publisher, {
        headers,
      });
      if (!data.successful) {
        setErrorMessage(data.payload);
        return data.payload;
      }

      dispatch({
        type: ActionType.INSERT_PUBLIHSER,
        payload: objCopy,
      });
    } catch (err) {
      setErrorMessage(err);
      console.error(err);
    }
  };
};
export const deletePublisher = (
  headers: any,
  obj: any,
  setErrorMessage: any
) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      const { data } = await AxiosCustom.delete(endpoints.PUBLISHER, {
        headers,
        data: {
          publisher: obj,
        },
      });
      if (!data.successful) {
        setErrorMessage(data.payload);
        return;
      }

      // dispatch({
      // 	type: ActionType.DELETE_PUBLISHER,
      // 	payload: obj,
      // })
    } catch (err) {
      setErrorMessage(err);
      console.error(err);
    }
  };
};

// ------- CAMPAIGN OPERATIONS--------
export const getCampaignAction = (headers: any) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      const { data } = await AxiosCustom.get(endpoints.CAMPAIGN, {
        headers,
      });
      if (!data.successful) {
        return;
      }

      dispatch({
        type: ActionType.GET_CAMPAIGN,
        payload: data.payload,
      });
    } catch (err) {
      console.error(err);
      // if (
      // 	window.location.pathname !== '/notlogged' &&
      // 	window.location.pathname !== '/'
      // ) {
      // 	window.location.replace(window.location.origin + '/notlogged')
      // }
    }
  };
};

export const reevaluateAction = (headers: any, setErrorMessage: any) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      const { data } = await AxiosCustom.post(
        endpoints.APPSFLYER + "/reevaluate",
        undefined,
        {
          headers,
        }
      );
      if (!data.successful) {
        //setErrorMessage(data.payload)
        return;
      }

      dispatch({
        type: ActionType.REEVALUATE,
        payload: data.payload,
      });
    } catch (err) {
      console.error(err);
      setErrorMessage(err);
    }
  };
};

export const getCampaignsInternalReport = (
  setFileDownload: any,
  rows: any,
  headers: any,
  setErrorMessage: any
) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      const report = { report: rows };
      const { data } = await AxiosCustom.post(
        endpoints.CAMPAIGN + "/internalreport",
        report,
        {
          headers,
        }
      );
      if (!data.successful) {
        setErrorMessage(data.payload);
        return;
      }
      setFileDownload(data.payload);
    } catch (err) {
      console.error(err);
      setErrorMessage(err);
    }
  };
};
