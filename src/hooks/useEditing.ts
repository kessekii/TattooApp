//make useAuth hook to handle authentication
import { useState } from "react";
import useLocalStorage from "./useLocalStorage";

export const useEditing = () => {
  const [isEditing, setIsEditing] = useLocalStorage("editingProfile", false);

  

  return { isEditing, setIsEditing };
};