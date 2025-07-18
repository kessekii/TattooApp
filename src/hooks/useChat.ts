import { useQueryClient } from "react-query";

import { useTypedSelector } from "./useTypedSelector";
import {baseURL} from "./../utils/Axios";
import useSlice from "./useSlice";

const BASE_URL = baseURL

export const getChatByChatId = async (chatId: string, username: string) => {
  try {
    const response = await fetch(
      BASE_URL+"/chats/getChatByChatId",
      
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + "AIzaSyC3zvtXPRpuYYTKEJsZ6WXync_-shMPkHM",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ chatId: chatId, username: username }),
      }
    );

    const result = await response.json();
    return result;
  } catch (error) {
    
  }
};
export const updateUserAndImage = async (
  username: any,
  image: any,
  backdrop: any
) => {
  try {
    const response = await fetch(
      BASE_URL + "users/updateUserAndImage",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + "AIzaSyC3zvtXPRpuYYTKEJsZ6WXync_-shMPkHM",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          user: username,
          image: image,
          backdrop: backdrop,
        }),
      }
    );
    const result = await response.json();
    return result;
  } catch (error) {
    
  }
};

export const getPostsByUserId = async (username: string) => {
  try {
    //
    const response = await fetch(
      BASE_URL + "posts/getPostsByUserId",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + "AIzaSyC3zvtXPRpuYYTKEJsZ6WXync_-shMPkHM",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ username: username }),
      }
    );

    const result = await response.json();
    return result;
  } catch (error) {
    
  }
};
export const getPrivateChatsByUserId = async (username: string) => {
  try {
    //
    const response = await fetch(
      BASE_URL + "chats/getPrivateChatsByUserId",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + "AIzaSyC3zvtXPRpuYYTKEJsZ6WXync_-shMPkHM",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ username: username }),
      }
    );

    const result = await response.json();

    return result;
  } catch (error) {
    
  }
};
export const getImageByImageId = async (imageId: string) => {
  try {
    //
    const response = await fetch(
      BASE_URL + "images/getImageByImageId",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + "AIzaSyC3zvtXPRpuYYTKEJsZ6WXync_-shMPkHM",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ imageId: imageId }),
      }
    );
    const result = await response.json();
   

    return result;
  } catch (error) {
    
  }
};
export const getImageIdsByUserId = async (username: string) => {
  try {
    //
    const response = await fetch(
      BASE_URL + "images/getImageIdsByUserId",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + "AIzaSyC3zvtXPRpuYYTKEJsZ6WXync_-shMPkHM",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ username: username }),
      }
    );
    const result = await response.json();

    return result;
  } catch (error) {
    
  }
};
export const getUserMapImagesByUserId = async (username: string) => {
  try {
    const response = await fetch(
      BASE_URL + "images/getUserMapImagesByUserId",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + "AIzaSyC3zvtXPRpuYYTKEJsZ6WXync_-shMPkHM",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ username: username }),
      }
    );
    const result = await response.json();

    return result;
  } catch (error) {
    
  }
};

export const getChatsByUserId = async (username: string) => {
  try {
    //
    const response = await fetch(
      BASE_URL + "chats/getChatsByUserId",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + "AIzaSyC3zvtXPRpuYYTKEJsZ6WXync_-shMPkHM",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ username: username }),
      }
    );

    const result = await response.json();
    return result;
  } catch (error) {
    
  }
};
export const getPointByQuadIdAndPointId = async (
  quadId: string,
  pointId: string
) => {
  try {
    const response = await fetch(
      BASE_URL + "points/getPointByQuadIdAndPointId",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + "AIzaSyC3zvtXPRpuYYTKEJsZ6WXync_-shMPkHM",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ quadId: quadId, pointId: pointId }),
      }
    );

    const result = await response.json();
    return result;
  } catch (error) {
    
  }
};
export const createPointByUsername = async (
  username: string,
  location: any,
  geocode: string
) => {
  try {
    const response = await fetch(
      BASE_URL + "points/createPointByUsername",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + "AIzaSyC3zvtXPRpuYYTKEJsZ6WXync_-shMPkHM",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          username: username,
          location: location,
          geocode: geocode,
        }),
      }
    );

    const result = await response.json();
    return result;
  } catch (error) {
    
  }
};
export const getPointsInRadius = async (location: any, blocked: any) => {
  try {
    const response = await fetch(
      BASE_URL + "points/getPointsInRadius",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + "AIzaSyC3zvtXPRpuYYTKEJsZ6WXync_-shMPkHM",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ coordOfCenter: location, blocked: blocked }),
      }
    );

    const result = await response.json();

    //;
    return result;
  } catch (error) {
    
  }
};
export const deletePointbyPointId = async (quadId: string, pointId: string) => {
  try {
    const response = await fetch(
      BASE_URL + "points/deletePointbyPointId",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + "AIzaSyC3zvtXPRpuYYTKEJsZ6WXync_-shMPkHM",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ quadId: quadId, pointId: pointId }),
      }
    );

    const result = response.json();
    return result;
  } catch (error) {
    
  }
};
export const getUserById = async (username: string) => {
  try {
    const response = await fetch(BASE_URL + "users/getProfileData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + "AIzaSyC3zvtXPRpuYYTKEJsZ6WXync_-shMPkHM",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ username: username }),
    });

    const result = response.json();
    return result;
  } catch (err) {
    
  }
};
export const updatePointbyPointId = async (quadId: string, point: string) => {
  try {
    const response = await fetch(BASE_URL + "points/updatePoint", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + "AIzaSyC3zvtXPRpuYYTKEJsZ6WXync_-shMPkHM",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ quadId: quadId, point: point }),
    });

    const result = response.json();
    return result;
  } catch (error) {
    
  }
};
export const updatePoint = async (point: any) => {
  try {
    const response = await fetch(BASE_URL + "points/updatePoint", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + "AIzaSyC3zvtXPRpuYYTKEJsZ6WXync_-shMPkHM",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ point: point }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    
  }
};
export const useChat = () => {
  const { data: user } = useSlice('user');
  // const queryClient = useQueryClient();

  const sendMessage = async (id: string, message: string) => {
    try {
      const response = await fetch(
        BASE_URL + "chats/addToChatByChatId",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer " + "AIzaSyC3zvtXPRpuYYTKEJsZ6WXync_-shMPkHM",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
            chatId: id,
            userEmail: user.email,
            data: message,
          }),
        }
      );

      // queryClient.invalidateQueries("chats");

      return response;
    } catch (error) {
      
    }
  };

  return {
    sendMessage,
    getChatByChatId,
  };
};
