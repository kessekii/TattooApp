import { useQueryClient } from "react-query";

import { useTypedSelector } from "./useTypedSelector";

export const useChat = () => {
  const { login } = useTypedSelector((state) => state);
  const queryClient = useQueryClient();

  const getChatByChatId = async (id: string, email: string) => {
    try {
      console.log("id", id, email);
      const response = await fetch("http://localhost:3000/chats/getChatByChatId", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + "AIzaSyC3zvtXPRpuYYTKEJsZ6WXync_-shMPkHM",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ chatId: id, userEmail: email }),
      });
      queryClient.invalidateQueries("chats");
      const result = await response.json();
      return result.payload;
    } catch (error) {
      console.log("error", error);
    }
  };

  const sendMessage = async (id: string, message: string) => {
    try {
      const response = await fetch(
        "http://localhost:3000/chats/addToChatByChatId",
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
