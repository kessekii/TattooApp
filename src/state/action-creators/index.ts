import { subDays } from "date-fns";
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
  username: string;
  password: string;
}

export interface newPasswordParams {
  email: string;
  newPassword: string;
}

export interface userParams {
  isSessionValid: boolean;
  userData: any;
}

export interface updateAppParams {
  app_id: string;
  status: boolean;
  email: string;
  created_by: string;
}

export interface ProfileData {
  name: string;
  username: string;
  type: string;
  location: string;
  backfrop: string,
  description: string;
  profilePicture: string;
  posts: Array<Post>;
  reviews: Array<Review>;
  friends: Array<Friend>;
  events: Array<NewsItem>;
  socialLinks: Array<SocialLink>;
  calendar: Array<CalendarEntry>;
  map: Array<any>;
}

export interface Post {
  id: number;
  image: string;
  likes: number;
  shares: number;
  user: { avatar: string; name: string };
  description: string;
  comments: Array<Comment>;
}

export interface Comment {
  author: string;
  text: string;
}

export interface Review {
  photo: string;
  nickname: string;
  text: string;
  mark: number;
}

export interface Friend {
  avatar: string;
  nickname: string;
  username: string;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface CalendarEntry {
  date: string;
  hours: Array<string>;
}

export interface NewsItem {
  id?: string;
  title: string;
  image: string;
  time: string;
  due: string;
  category: string;
  views: number;
  likes: number;
  comments: Array<{ author: string; text: string }>;
  shares: number;
}

const handlePosts = async (filter: any) => {
  try {
    const headers = {
      Authorization: "Bearer " + "AIzaSyC3zvtXPRpuYYTKEJsZ6WXync_-shMPkHM",
    };
    const { data } = await AxiosCustom.post(
      endpoints.GETPOSTS,
      { city: filter.split(",")[0] },
      {
        headers,
      }
    );
    return data;
  } catch (e) {
    
  }
};

export const updatePost = async (postId: string, post: any) => {
  try {
    const headers = {
      Authorization: "Bearer " + "AIzaSyC3zvtXPRpuYYTKEJsZ6WXync_-shMPkHM",
    };
    const { data } = await AxiosCustom.post(
      endpoints.UPDATEPOST,
      { postId: postId, post: post},
      {
        headers,
      }
    );
    return data.payload;
  } catch (e) {
    
  }
};

export const getPostImageByPostId = async (postId: any) => {
  try {
    const headers = {
      Authorization: "Bearer " + "AIzaSyC3zvtXPRpuYYTKEJsZ6WXync_-shMPkHM",
    };
    const { data } = await AxiosCustom.post(
      endpoints.GETPOSTIMAGEBYPOSTID,
      { postId },
      {
        headers,
      }
    );

    return data.payload;
  } catch (e) {
    
  }
};
export const getPostByPostId = async (postId: any) => {
  try {
    const headers = {
      Authorization: "Bearer " + "AIzaSyC3zvtXPRpuYYTKEJsZ6WXync_-shMPkHM",
    };
    const { data } = await AxiosCustom.post(
      endpoints.GETPOSTBYPOSTID,
      { postId },
      {
        headers,
      }
    );

    return data.payload;
  } catch (e) {
    
  }
};
export const getTrendingPostsByCityAction = async (city: any) => {
  try {
    const headers = {
      Authorization: "Bearer " + "AIzaSyC3zvtXPRpuYYTKEJsZ6WXync_-shMPkHM",
    };
    
    const { data } = await AxiosCustom.post(
      endpoints.GETTRENDINGPOSTS,
      { city },
      {
        headers,
      }
    );
    return data;
  } catch (e) {
    
  }
};
//------------NEWS OPERATIONS ------------
export const getNewsAction = async (filter: string) => {
  try {
    const headers = {
      Authorization: "Bearer " + "AIzaSyC3zvtXPRpuYYTKEJsZ6WXync_-shMPkHM",
    };

    // const loggetting = await AxiosCustom.post(
    //   "http://46.117.80.103:4000:8000",
    //   loginParams,
    //   {
    //     headers,
    //   }
    // );
    //;

    const { data } = await AxiosCustom.post(
      endpoints.NEWS,
      { city: filter.split(",")[0], country: filter.split(",")[1] },
      {
        headers,
      }
    );

    type PointData = {
      pointId: string;
      data: Record<string, any>; // adjust type as needed for data structure
    };

    function transformEventsData(inputData: {
      [key: number]: PointData[];
    }): Record<string, any> {
      return Object.assign(
        {},
        ...Object.values(inputData)
          .flat()
          .map((item) => ({ [item.pointId]: { ...item } }))
          .filter((pointId: any) => {
            return !pointId.undefined;
          })
      );
    }
    function omitFieldsFromData(
      data: Record<string, any>,
      omitFields: string[]
    ): Record<string, any> {
      return Object.fromEntries(
        Object.entries(data).filter(([key]) => !omitFields.includes(key))
      );
    }

    const postsPayload = await getTrendingPostsByCityAction({
      city: filter.split(",")[0],
    });
    const eventsDataDict: Record<string, any> = transformEventsData(
      data.payload.events
    );
    const postsDataDict: Record<string, any> = postsPayload.payload;

    // .map((autdat) => autdat).filter((out) => out.pointId !== undefined)

    return { events: eventsDataDict, posts: postsDataDict };
  } catch (err) {
    
    return false;
  }
};

export const makeEventAction = async (payload: any) => {
  try {
    const headers = {
      Authorization: "Bearer " + "AIzaSyC3zvtXPRpuYYTKEJsZ6WXync_-shMPkHM",
    };

    // const loggetting = await AxiosCustom.post(
    //   "http://46.117.80.103:4000:8000",
    //   loginParams,
    //   {
    //     headers,
    //   }
    // );
    //;
    const { data } = await AxiosCustom.post(endpoints.MAKEEVENT, payload, {
      headers,
    });

    if (!data.successful) {
      return data.payload;
    }

    return data.payload;
  } catch (err) {
    
    return false;
  }
};

// --------- USERS OPERATION --------
export const loginAction = async (loginParams: any, setErrorMessage: any) => {
  try {
    const headers = {
      Authorization: "Bearer " + "AIzaSyC3zvtXPRpuYYTKEJsZ6WXync_-shMPkHM",
    };
    const user = JSON.stringify(loginParams);
    // const loggetting = await AxiosCustom.post(
    //   "http://46.117.80.103:4000:8000",
    //   loginParams,
    //   {
    //     headers,
    //   }
    // );
    //;
    const { data } = await AxiosCustom.post(endpoints.LOGIN, loginParams, {
      headers,
    });

    if (!data.successful) {
      setErrorMessage(data.payload);
      return data.payload;
    }
    return data.payload;
  } catch (err) {
    
    return false;
  }
};

export const openPostAndChatByUserAndPostId = async (
  user: any,

  setErrorMessage: any,
  newPost?: string
) => {
  try {
    const headers = {
      Authorization: "Bearer " + "AIzaSyC3zvtXPRpuYYTKEJsZ6WXync_-shMPkHM",
    };

    const { data } = await AxiosCustom.post(
      "chats/openPostAndChatByUserAndPostId",
      { user, newPost },
      {
        headers,
      }
    );

    if (!data.successful) {
      setErrorMessage(data.payload);
      return;
    }

    return data;
  } catch (err) {
    setErrorMessage(err);
    console.error(err);
  }
};
export const createChatByUsername = async (
  user: any,

  setErrorMessage: any,
  post?: any
) => {
  try {
    const headers = {
      Authorization: "Bearer " + "AIzaSyC3zvtXPRpuYYTKEJsZ6WXync_-shMPkHM",
    };

    const { data } = await AxiosCustom.post(
      "chats/openPostAndChatByUserAndPostId",
      { user, post },
      {
        headers,
      }
    );

    if (!data.successful) {
      //setErrorMessage(data.payload);
      return;
    }

    return data;
  } catch (err) {
    //setErrorMessage(err);
    console.error(err);
  }
};
export const updateUserStriaght = async (user: any, setErrorMessage: any) => {
  try {
    const headers = {
      Authorization: "Bearer " + "AIzaSyC3zvtXPRpuYYTKEJsZ6WXync_-shMPkHM",
    };

    const { data } = await AxiosCustom.post(endpoints.UPDATE_USER, user, {
      headers,
    });

    return data;
  } catch (err) {
    setErrorMessage(err);
    console.error(err);
  }
};
export const updateUser = (user: any, setErrorMessage: any) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      const headers = {
        Authorization: "Bearer " + "AIzaSyC3zvtXPRpuYYTKEJsZ6WXync_-shMPkHM",
      };

      const { data } = await AxiosCustom.post(endpoints.UPDATE_USER, user, {
        headers,
      });

      if (!data.successful) {
        setErrorMessage(data.payload);
        return;
      }

      dispatch({
        type: ActionType.LOGIN,
        payload: data.payload,
      });
    } catch (err) {
      setErrorMessage(err);
      console.error(err);
    }
  };
};
export const updateChat = (chat: any, chatId: string, setErrorMessage: any) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      const headers = {
        Authorization: "Bearer " + "AIzaSyC3zvtXPRpuYYTKEJsZ6WXync_-shMPkHM",
      };

      const { data } = await AxiosCustom.post(
        "chats/updateChat",
        { chat, chatId },
        {
          headers,
        }
      );

      if (!data.successful) {
        setErrorMessage(data.payload);
        return;
      }

      dispatch({
        type: ActionType.UPDATE_CHAT,
        payload: data.payload,
      });
    } catch (err) {
      setErrorMessage(err);
      console.error(err);
    }
  };
};
export const openPrivateChatByUsername = async (
  username: string,
  friendUsername: string
) => {
  try {
    const headers = {
      Authorization: "Bearer " + "AIzaSyC3zvtXPRpuYYTKEJsZ6WXync_-shMPkHM",
    };

    const { data } = await AxiosCustom.post(
      "chats/openPrivateChatByUsername",
      { username, friendUsername },
      {
        headers,
      }
    );

    return data;
  } catch (err) {
    console.error(err);
  }
};
export const updateChatStraight = async (chat: any, chatId: string) => {
  try {
    const headers = {
      Authorization: "Bearer " + "AIzaSyC3zvtXPRpuYYTKEJsZ6WXync_-shMPkHM",
    };

    const { data } = await AxiosCustom.post(
      "chats/updateChat",
      { chat, chatId },
      {
        headers,
      }
    );

    return data;
  } catch (err) {
    console.error(err);
  }
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
export const createLivestreamAction = (userEmail: string) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + "AIzaSyC3zvtXPRpuYYTKEJsZ6WXync_-shMPkHM",
        "Access-Control-Allow-Origin": "*",
      };
      const user = JSON.stringify(userEmail);

      const { data } = await AxiosCustom.post(
        endpoints.LIVESTREAMCREATE,
        JSON.stringify({ userEmail: userEmail }),
        { headers }
      );
      dispatch({
        type: ActionType.LIVESTREAMCREATE,
        payload: data.payload,
      });
      if (!data.successful) {
        return data.payload;
      }

      return true;
    } catch (err) {
      return false;
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
export const logOutAction = () => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      dispatch({
        type: ActionType.LOGOUT,
        payload: undefined,
      });
    } catch (err) {
      console.error(err);
    }
  };
};

export const addNotificationAction = (message, type) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      dispatch({
        type: ActionType.ADD_NOTIFICATION,
        payload: {
          type: type,
          message: message,
          timeout: 5000,
          asPortal: false,
          withTimeout: true,
        },
      });

      return;
    } catch (err) {
      
      return;
    }
  };
};

export const getChatsByChatId = async (chatId: any) => {
  try {
    const headers = {
      Authorization: "Bearer " + "AIzaSyC3zvtXPRpuYYTKEJsZ6WXync_-shMPkHM",
    };
    
    const { data } = await AxiosCustom.post(
      endpoints.GETCHATBYCHATID,
      { chatId },
      {
        headers,
      }
    );
    return data;
  } catch (err) {
    
    return false;
  }
};

export const getProfileData = async (username: any) => {
  try {
    const headers = {
      Authorization: "Bearer " + "AIzaSyC3zvtXPRpuYYTKEJsZ6WXync_-shMPkHM",
    };
    const { data } = await AxiosCustom.post(
      endpoints.GETPROFILEDATA,
      { username },
      {
        headers,
      }
    );

    return data;
  } catch (err) {
    
    return false;
  }
};

export interface ModalData {
  content: object;
  onCancel?: () => void;
  onConfirm?: (data?: any) => boolean | Promise<boolean>;
  onSave?: (data?: any) => void;
  lastFocusedElement?: React.RefObject<HTMLElement>;
  type?: string;
}

export const openModal = (modalData: ModalData) => ({
  type: ActionType.OPEN_MODAL,
  payload: modalData,
});

export const closeModal = ({
  shouldCancel = true,
  shouldRefocus = true,
}: { shouldCancel?: boolean; shouldRefocus?: boolean } = {}) => ({
  type: ActionType.CLOSE_MODAL,
  payload: { shouldCancel, shouldRefocus },
});

export const setModalOpenState = (isModalOpen: boolean) => ({
  type: ActionType.SET_MODAL_OPEN_STATE,
  payload: isModalOpen,
});

export const setModalConfirm = (data?: any) => ({
  type: ActionType.SET_MODAL_CONFIRM,
  payload: data,
});
