import { useQueryClient } from "react-query";

import { useTypedSelector } from "./useTypedSelector";
export const getChatByChatId = async (chatId: string, username: string) => {
  try {
    console.log("id", chatId, username);
    const response = await fetch(
      "http://localhost:4000/chats/getChatByChatId",
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
    console.log(result);
    return result;
  } catch (error) {
    console.log("error", error);
  }
};
export const getPointByPointId = async (pointId: string) => {
  try {
    const response = await fetch(
      "http://localhost:4000/points/getPointByPointId",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + "AIzaSyC3zvtXPRpuYYTKEJsZ6WXync_-shMPkHM",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ pointId: pointId }),
      }
    );

    const result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    console.log("error", error);
  }
};
export const createPointByUsername = async (
  username: string,
  location: any
) => {
  try {
    const response = await fetch(
      "http://localhost:4000/points/createPointByUsername",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + "AIzaSyC3zvtXPRpuYYTKEJsZ6WXync_-shMPkHM",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ username: username, location: location }),
      }
    );

    const result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    console.log("error", error);
  }
};
export const getPointsInRadius = async (location: any, radius: any) => {
  try {
    const response = await fetch(
      "http://localhost:4000/points/getPointsInRadius",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + "AIzaSyC3zvtXPRpuYYTKEJsZ6WXync_-shMPkHM",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ coordOfCenter: location, radius: radius }),
      }
    );

    const result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    console.log("error", error);
  }
};
export const deletePointbyPointId = async (pointId: string) => {
  try {
    const response = await fetch(
      "http://localhost:4000/points/deletePointbyPointId",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + "AIzaSyC3zvtXPRpuYYTKEJsZ6WXync_-shMPkHM",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ pointId: pointId }),
      }
    );

    const result = response.json();
    console.log(result);
    return result;
  } catch (error) {
    console.log("error", error);
  }
};
export const updatePoint = async (point: any) => {
  try {
    const response = await fetch("http://localhost:4000/points/updatePoint", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + "AIzaSyC3zvtXPRpuYYTKEJsZ6WXync_-shMPkHM",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ point: point }),
    });

    const result = await response.json();
    console.log(result);
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
        "http://localhost:4000/chats/addToChatByChatId",
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
