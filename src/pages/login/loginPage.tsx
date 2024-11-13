import { Checkbox, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useActions } from "../../hooks/useActions";
import { useAuth } from "../../hooks/useAuth";
import useLocalStorage from "../../hooks/useLocalStorage";
import {
  ForgotPasswordComponent,
  LoginButton,
  LoginComponent,
  LoginPageWrapper,
  LoginWrapper,
  RememberMeComponent,
  TitleComponent,
} from "./loginPageComponents";
import AxiosCustom from "../../utils/Axios";
import { ForgotPasswordPopup } from "./forgotPasswordComponent";
import { useTheme } from "../../state/providers/themeProvider";
import {
  getPointsInRadius,
  getChatsByUserId,
  getPostsByUserId,
  getImageIdsByUserId,
  getImageByImageId,
} from "../../hooks/useChat";
import { getNewsAction, loginAction } from "../../state/action-creators";
import {
  getAvatars,
  getPointImageByPointId,
} from "../../utils/helpers/helperFuncs";
import { useQuery, gql } from "@apollo/client";
import { c } from "vite/dist/node/types.d-aGj9QkWt";
import { defultLocation } from "../../../src/state";
import {
  IMAGES_QUERY,
  NEWS_QUERY,
  POINTS_QUERY,
  USER_QUERY,
} from "../../../src/graphQL/queries";

const LoginPage = () => {
  const { themevars } = useTheme();
  const [login, setLogin] = useState("");
  const [loginAttempt, setLoginAttempt] = useState("");
  const pointsGraphQLHook = useQuery(POINTS_QUERY, {
    variables: {
      coordOfCenter: defultLocation,
    },
  });
  const userGraphQLHook = useQuery(USER_QUERY, {
    variables: { username: login },
  });
  const imageGraphQLHook = useQuery(IMAGES_QUERY, {
    variables: { username: login },
  });
  const newsGraphQLHook = useQuery(NEWS_QUERY, {
    variables: { city: "Bat Yam", country: "Israel" },
  });
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [user, setUser] = useLocalStorage("user", null);
  const [chats, setChats] = useLocalStorage("chats", null);
  const [friend, setFriend] = useLocalStorage("friend", null);
  const [avatars, setAvatars] = useLocalStorage("avatars", null);
  const [posts, setPosts] = useLocalStorage("posts", null);
  const [news, setNews] = useLocalStorage("news", null);
  const [images, setImages] = useLocalStorage("images", null);
  const [points, setPoints] = useLocalStorage("points", null);
  const [mapImages, setMapImages] = useLocalStorage("mapImages", null);
  const [friendPosts, setFriendPosts] = useLocalStorage("friendPosts", null);
  const [friendChats, setFriendChats] = useLocalStorage("friendChats", null);
  const [loading, setLoading] = useLocalStorage("loading", null);
  const auth = useAuth();
  const navigate = useNavigate();

  const tryLogin = async () => {
    if (!login || !password) return;
    try {
      const userGQL = (await userGraphQLHook.refetch({ username: login })).data
        .getProfileData;

      const pointsGQL = (
        await pointsGraphQLHook.refetch({
          coordOfCenter: { lat: 32.02119878251853, lng: 34.74333323660794 },
          blocked: false,
        })
      ).data.getPointsInRadius;

      const imageGQL = (await imageGraphQLHook.refetch({ username: login }))
        .data.getAllImagesByUserPage;

      setUser(userGQL);
      setPoints(pointsGQL);
      setChats(userGQL.chats);
      setPosts(userGQL.posts);
      setFriend(userGQL);
      setFriendPosts(userGQL.posts);
      setFriendChats(userGQL.chats);
      setImages(imageGQL.posts);
      setMapImages(imageGQL.map);
      setAvatars(imageGQL.avatars);
      if (userGQL.location) {
        const newsGQL = (
          await newsGraphQLHook.refetch({
            city: userGQL.location.split(",")[0],
            country: userGQL.location.split(",")[1],
          })
        ).data.getNewsByGeo;
        setNews(newsGQL);
      }
      navigate(`/${userGQL.username}`);
      // await auth.setUserFull(loginData.payload);
    } catch (error) {
      console.log("Error", error);
    }
  };

  useEffect(() => {
    if (errorMessage) {
      setIsVisible(false);
    }
  }, [errorMessage]);

  return (
    <LoginPageWrapper>
      <TitleComponent>TATTOO APP</TitleComponent>
      <LoginWrapper>
        <Typography style={{ marginBottom: "20px" }}>
          Login to Your Account
        </Typography>
        <LoginComponent
          variant="filled"
          id="login"
          key="login-form"
          label="Username"
          placeholder="kiseki"
          inputProps={{ style: { color: themevars.text } }}
          InputLabelProps={{
            style: { color: themevars.text, fontSize: "12px" },
          }}
          onChange={(e) => setLogin(e.target.value)}
          value={login}
        />
        <LoginComponent
          variant="filled"
          id="standard-password-input"
          label="Password"
          type="password"
          key="password-form"
          inputProps={{ style: { color: themevars.text } }}
          InputLabelProps={{
            style: { color: themevars.text, fontSize: "12px" },
          }}
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <RememberMeComponent
          control={
            <Checkbox
              style={{ stroke: themevars.text, color: themevars.text }}
            />
          }
          label={
            <Typography style={{ fontSize: "12px" }}>
              Keep me logged in
            </Typography>
          }
        />
        <ForgotPasswordComponent
          style={{ fontSize: "12px", fontWeight: "semi-bold" }}
          onClick={() => setIsVisible(true)}
        >
          Forgot Password?
        </ForgotPasswordComponent>
        <LoginButton
          variant="contained"
          size="large"
          onClick={async () => {
            setLoginAttempt(login);
            await tryLogin();
          }}
          style={{ marginBottom: "5px" }}
        >
          Login
        </LoginButton>
        <LoginButton
          variant="contained"
          size="large"
          onClick={() => navigate("/register")}
        >
          Sign Up
        </LoginButton>
      </LoginWrapper>

      {isVisible && (
        <ForgotPasswordPopup
          isVisible
          setIsVisible={setIsVisible}
          setErrorMessage={setErrorMessage}
        />
      )}
    </LoginPageWrapper>
  );
};

export default LoginPage;
