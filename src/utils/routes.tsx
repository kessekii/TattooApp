import { Outlet } from "react-router-dom";
import { useTypedSelector } from "../hooks/useTypedSelector";
import React, { useEffect } from "react";
import NotLogged from "./NotLogged";
import jwt_decode from "jwt-decode";

const useAuth = (token: any) => {
  // const data: any = decodeJwt(token)
  // if (Date.now() > data.exp * 1000) {
  // 	return false
  // }
  return true;
};
const decodeJwt = (token: string) => {
  try {
    const decodedToken = jwt_decode(token);
    return decodedToken;
  } catch (error) {
    console.error(error);
    return null;
  }
};
const ProtectedRoutes = () => {
  const { login } = useTypedSelector((state) => state);

  console.log("ProtectedRoutes: :login", login);
  return <Outlet />;
};

export default ProtectedRoutes;
