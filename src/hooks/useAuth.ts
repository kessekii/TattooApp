//make useAuth hook to handle authentication
import { useState } from "react";
import useLocalStorage from "./useLocalStorage";

export const useAuth = () => {
  const [user, setUser] = useLocalStorage("user", null);

  const login = async (password: string, username: string) => {
    try {
      setUser({ username, password });
    } catch (error) {
      console.log(error);
    }
  };

  const setUserFull = async (data) => {
    setUser(data);
  };
  const logout = async () => {
    setUser(null);
  };

  const register = async (password: string, username: string) => {
    setUser({ username, password });
  };

  return { user, login, setUserFull, logout, register };
};
