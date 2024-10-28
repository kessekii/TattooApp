import { useState } from "react";
import useLocalStorage from "./useLocalStorage";

export const useEditing = () => {
  const [isEditing, setIsEditing] = useLocalStorage("editingProfile", false);

  const setIsEditingProfile = async () => {
    setIsEditing(!isEditing);
    // setChats(Object.keys(user.chats));
  };

  return { isEditing, setIsEditingProfile };
};
