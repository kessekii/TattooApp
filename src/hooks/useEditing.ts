
import { useState } from "react";
import useLocalStorage from "./useLocalStorage";

export const useEditing = () => {
  const [isEditing, setIsEditing] = useLocalStorage("editingProfile", false);

  const setIsEditingProfile = async () => {
    setIsEditing(!isEditing);
    // setChats(Object.keys(user.chats));
  }

  console.log("EDITING : ", isEditing)

  return { isEditing, setIsEditingProfile };
};