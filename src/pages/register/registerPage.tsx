//register page using tailwindcss
import React, { useState, useTransition } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";

// import { Page } from "../components/Page";
// import { Logo } from "../assets/logo";
// import { Form } from "../components/Form";
// import { Link } from "../components/Link";
// import { Button } from "../components/Button";
import { Form, Link, Outlet, useNavigate } from "react-router-dom";
import { useActions } from "../../hooks/useActions";
import { Button, Input } from "@mui/material";
export interface Comment {
  author: string;
  text: string;
}
export interface PostSocial {
  id: number;
  image: string;
  likes: number;
  shares: number;
  user: {
    avatar: string;
    username: any;
  };
  description: string;
  comments: Comment[];
}

export interface Friends {
  avatar: string;
  name: string;
  username: string;
}

export interface Reviews {
  photo: string;
  username: string;
  text: string;
  mark: number;
}

export interface Calendar {
  date: string;
  hours: string[];
}

export interface SocialLinks {
  platform: string;
  url: string;
}

export interface MapData {
  key: string;
  location: google.maps.LatLngLiteral;
  name: string;
  icon: any;
  discription: string;
  username: string;
}

export interface User {
  name: string;
  username: any;
  userEmail: any;
  password: any;
  type: string;
  location: string;
  description: string;
  profilePicture: string;
  posts: PostSocial[];
  friends: Friends[];
  reviews: Reviews[];
  calendar: Calendar[];
  socialLinks: SocialLinks[];
  map: MapData[];
}
export const RegisterPage = () => {
  const auth = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { insertUser } = useActions();
  console.log("RegisterPage");
  const navigate = useNavigate();
  const handleRegister = async () => {
    try {
      await auth.register(password, username);
      insertUser(
        { password: password, username: username, userEmail: email },
        setErrorMessage
      );
      navigate("/");
    } catch (error) {
      toast.error("register.error");
    }
  };

  return (
    <div>
      <Input
        type="email"
        placeholder={"register.email"}
        value={email}
        onChange={(e: any) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        placeholder={"register.password"}
        value={password}
        onChange={(e: any) => setPassword(e.target.value)}
      />
      <Input
        type="username"
        placeholder={"register.username"}
        value={username}
        onChange={(e: any) => setUsername(e.target.value)}
      />
      <Button onClick={handleRegister}>{"register.register"}</Button>
      <Link to="/login">{"register.login"}</Link>
    </div>
  );
};
export default RegisterPage;
