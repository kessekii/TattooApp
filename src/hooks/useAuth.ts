//make useAuth hook to handle authentication
import { useState } from "react";
import useLocalStorage from "./useLocalStorage";

export const useAuth = () => {
  const [user, setUser] = useLocalStorage("user", null);
  const [chats, setChats] = useLocalStorage("chats", null);
  const login = async (username: string, password: string) => {
    try {
      setUser({ username, password });
    } catch (error) {
      console.log(error);
    }
  };
  const setUserFull = async (user: any) => {
    setUser(user);
    // setChats(Object.keys(user.chats));
  };

  const logout = async () => {
    setUser(null);
  };

  const register = async (email: string, password: string) => {
    setUser({ email });
  };

  return { user, login, logout, register, setUserFull };
};
