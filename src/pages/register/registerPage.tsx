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
import { Button, Input, Typography } from "@mui/material";
import { LoginButton, LoginComponent, LoginPageWrapper, LoginWrapper, TitleComponent } from "../login/loginPageComponents";
import { useTheme } from "../../state/providers/themeProvider";

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
  const { themevars } = useTheme();
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

    <LoginPageWrapper>
      <TitleComponent>TATTOO APP</TitleComponent>
      <LoginWrapper>
        <Typography style={{ marginBottom: '20px' }}>{"Register new account"}</Typography>
        <LoginComponent
          variant="filled"
          id="login"
          key="login-form"
          label="Username"
          placeholder="kiseki"
          inputProps={{
            style: {
              color: themevars.text, // Access theme's text color
            },
          }}
          InputLabelProps={{
            style: {
              color: themevars.text,
              fontSize: "12px",
            },
          }}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          value={email}
        />
        <LoginComponent
          variant="filled"
          id="standard-password-input"
          label="Password"
          type="password"
          key="password-form"
          inputProps={{
            style: {
              color: themevars.text, // Access theme's text color
            },
          }}
          InputLabelProps={{
            style: {
              color: themevars.text,
              fontSize: "12px",
            },
          }}
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <LoginComponent
          variant="filled"
          id="standard-username-input"
          label="Username"
          type="username"
          key="username-form"
          inputProps={{
            style: {
              color: themevars.text, // Access theme's text color
            },
          }}
          InputLabelProps={{
            style: {
              color: themevars.text,
              fontSize: "12px",
            },
          }}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
        <LoginButton variant="contained"
          size="large" style={{ marginTop: '50px' }} onClick={handleRegister}>{"Sign Up"}</LoginButton>
        <LoginButton
          style={{ marginTop: '5px' }}
          variant="contained"
          size="large"
          onClick={() => navigate("/")}
        >
          Log In
        </LoginButton>
      </LoginWrapper>
    </LoginPageWrapper>
  );
};
export default RegisterPage;
