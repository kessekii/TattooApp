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
import {
  useTheme,
  useWindowDimensions,
} from "../../state/providers/themeProvider";
import {
  getPointByQuadIdAndPointId,
  getChatByChatId,
  getPointsInRadius,
  getChatsByUserId,
  getPostsByUserId,
  getImageIdsByUserId,
  getImageByImageId,
} from "../../hooks/useChat";
import { getNewsAction, getProfileData } from "../../state/action-creators";
import AngledBackgroundComponent from "../masterspage/backgroundComponent";
import { get } from "video.js/dist/types/tech/middleware";
import { getAvatars } from "./../../utils/helpers/helperFuncs";

const RepositoriesList = () => {
  const { theme, themevars, toggleTheme } = useTheme(); // Access custom theme
  const [loginF, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [port, setPort] = useState(2);
  const [isVisible, setIsVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { loginAction } = useActions();
  const [user, setUser] = useLocalStorage("user", null);
  const [chats, setChats] = useLocalStorage("chats", null);
  const [friend, setFriend] = useLocalStorage("friend", null);
  const [avatars, setAvatars] = useLocalStorage("avatars", null);
  const [posts, setPosts] = useLocalStorage("posts", null);
  const [news, setNews] = useLocalStorage("news", null);
  const [imageIds, setImageIds] = useLocalStorage("imageIds", null);
  const [images, setImages] = useLocalStorage("images", null);
  const [screen, setScreen] = useLocalStorage("screen", null);

  const [friendPosts, setFriendPosts] = useLocalStorage("friendPosts", null);
  const [friendChats, setFriendChats] = useLocalStorage("friendChats", null);
  const auth = useAuth();
  const [points, setPoints] = useLocalStorage("points", null);
  const navigate = useNavigate();

  const tryLogin = async () => {
    try {
      if (loginF && password) {
        loginAction({ username: loginF, password: password }, setErrorMessage);
        await auth.login(password, loginF);
        // await auth.setUserFull(user);
        const userData = await getProfileData(loginF);
        //
        // const temp = { ...userData.payload.event, events: [], chats: [], points: [] };

        const chatData = await getChatsByUserId(loginF);
        const postsData = await getPostsByUserId(loginF);

        const pointsObject = await getPointsInRadius(
          {
            lat: 32.02119878251853,
            lng: 34.74333323660794,
          },
          false
        );
        const imageIds = await getImageIdsByUserId(loginF);

        const [avatarIds, avatarsImagesdata]: any[] = await getAvatars(
          userData.payload
        );
        setAvatars(avatarsImagesdata || {});
        if (avatarIds && avatarIds.length > 0) {
          // const unique = imageIds.payload.filter(
          //   (obj) => !avatarIds.some((id) => obj === id)
          // );
          let newimages = {};
          for (let imageId of avatarIds) {
            const image = await getImageByImageId(imageId);
            if (image && image.payload) {
              newimages = { ...newimages, [imageId]: image.payload };
            }
          }
          setImages(newimages || {});
          setImageIds(imageIds.payload || []);
        }

        setFriend(userData.payload);
        setPosts(postsData.payload);
        setChats(chatData.payload);
        setFriendChats(chatData.payload);
        setFriendPosts(postsData.payload);
        setPoints(pointsObject.payload);
        if (userData.payload.location) {
          const newsData = await getNewsAction(userData.payload.location);
          setNews(newsData);
        }

        await auth.setUserFull(userData.payload);

        navigate("/" + loginF);
      }
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
          {"Login to Your Account"}
        </Typography>
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
            setLogin(e.target.value);
          }}
          value={loginF}
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

        <RememberMeComponent
          control={
            <Checkbox
              style={{
                stroke: themevars.text,
                color: themevars.text, // Access theme's text color
              }}
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
      {errorMessage && (
        <div style={{ marginTop: "8%", color: "red" }}>
          Error: {errorMessage}
        </div>
      )}

      {isVisible ? (
        <ForgotPasswordPopup
          isVisible
          setIsVisible={setIsVisible}
          setErrorMessage={setErrorMessage}
        />
      ) : null}
    </LoginPageWrapper>
  );
};

export default RepositoriesList;
