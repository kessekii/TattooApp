import { useQueryClient } from "react-query";

import { useTypedSelector } from "./useTypedSelector";
export const getChatByChatId = async (chatId: string, username: string) => {
  try {
    const response = await fetch(
      "http://46.117.80.103:4000/chats/getChatByChatId",
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
    console.log("error", error);
  }
};
export const updateUserAndImage = async (
  username: any,
  image: any,
  backdrop: any
) => {
  try {
    const response = await fetch(
      "http://46.117.80.103:4000/users/updateUserAndImage",
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
    console.log("error", error);
  }
};

export const getPostsByUserId = async (username: string) => {
  try {
    //
    const response = await fetch(
      "http://46.117.80.103:4000/posts/getPostsByUserId",
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
    console.log("error", error);
  }
};
export const getPrivateChatsByUserId = async (username: string) => {
  try {
    //
    const response = await fetch(
      "http://46.117.80.103:4000/chats/getPrivateChatsByUserId",
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
    console.log("error", error);
  }
};
export const getImageByImageId = async (imageId: string) => {
  try {
    //
    const response = await fetch(
      "http://46.117.80.103:4000/images/getImageByImageId",
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
    console.log("error", error);
  }
};
export const getImageIdsByUserId = async (username: string) => {
  try {
    //
    const response = await fetch(
      "http://46.117.80.103:4000/images/getImageIdsByUserId",
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
    console.log("error", error);
  }
};
export const getUserMapImagesByUserId = async (username: string) => {
  try {
    //
    const response = await fetch(
      "http://46.117.80.103:4000/images/getUserMapImagesByUserId",
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
    console.log("error", error);
  }
};

export const getChatsByUserId = async (username: string) => {
  try {
    //
    const response = await fetch(
      "http://46.117.80.103:4000/chats/getChatsByUserId",
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
    console.log("error", error);
  }
};
export const getPointByQuadIdAndPointId = async (
  quadId: string,
  pointId: string
) => {
  try {
    const response = await fetch(
      "http://46.117.80.103:4000/points/getPointByQuadIdAndPointId",
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
    console.log("error", error);
  }
};
export const createPointByUsername = async (
  username: string,
  location: any,
  geocode: string
) => {
  try {
    const response = await fetch(
      "http://46.117.80.103:4000/points/createPointByUsername",
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
    console.log("error", error);
  }
};
export const getPointsInRadius = async (location: any, blocked: any) => {
  try {
    const response = await fetch(
      "http://46.117.80.103:4000/points/getPointsInRadius",
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
    console.log("error", error);
  }
};
export const deletePointbyPointId = async (quadId: string, pointId: string) => {
  try {
    const response = await fetch(
      "http://46.117.80.103:4000/points/deletePointbyPointId",
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
    console.log("error", error);
  }
};
export const getUserById = async (username: string) => {
  try {
    const response = await fetch(
      "http://46.117.80.103:4000/users/getProfileData",
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

    const result = response.json();
    return result;
  } catch (err) {
    console.log(err);
  }
};
export const updatePointbyPointId = async (quadId: string, point: string) => {
  try {
    const response = await fetch(
      "http://46.117.80.103:4000/points/updatePoint",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + "AIzaSyC3zvtXPRpuYYTKEJsZ6WXync_-shMPkHM",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ quadId: quadId, point: point }),
      }
    );

    const result = response.json();
    return result;
  } catch (error) {
    console.log("error", error);
  }
};
export const updatePoint = async (point: any) => {
  try {
    const response = await fetch(
      "http://46.117.80.103:4000/points/updatePoint",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + "AIzaSyC3zvtXPRpuYYTKEJsZ6WXync_-shMPkHM",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ point: point }),
      }
    );

    const result = await response.json();
    return result;
  } catch (error) {
    console.log("error", error);
  }
};
export const useChat = () => {
  const { login } = useTypedSelector((state) => state);
  const queryClient = useQueryClient();

  const sendMessage = async (id: string, message: string) => {
    try {
      const response = await fetch(
        "http://46.117.80.103:4000/chats/addToChatByChatId",
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
            userEmail: login.user.email,
            data: message,
          }),
        }
      );

      queryClient.invalidateQueries("chats");

      return response;
    } catch (error) {
      console.log("error", error);
    }
  };

  return {
    sendMessage,
    getChatByChatId,
  };
};
