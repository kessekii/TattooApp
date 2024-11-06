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

const LoginPage = () => {
  const { themevars } = useTheme();
  const [loginF, setLogin] = useState("");
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
    if (!loginF || !password) return;

    try {
      setLoading(true);
      const loginData = await loginAction(
        { username: loginF, password: password },
        setErrorMessage
      );
      if (!loginData || !loginData.username) return;

      // await auth.login(loginF, password);

      const [chatData, postsData, pointsObject, imageIds] = await Promise.all([
        getChatsByUserId(loginData.username),
        getPostsByUserId(loginData.username),
        getPointsInRadius(
          { lat: 32.02119878251853, lng: 34.74333323660794 },
          false
        ),
        getImageIdsByUserId(loginData.username),
      ]);

      const [avatarIds, avatarsImagesdata] = await getAvatars(loginData);
      const nonAvatarImages = imageIds.payload?.filter(
        (e) => !avatarIds?.includes(e)
      );

      const newImages = await Promise.all(
        nonAvatarImages?.map(async (imageId) => {
          const image = await getImageByImageId(imageId);
          return image && image.payload ? { [imageId]: image.payload } : {};
        })
      );
      const pointsInRaduis = await getPointsInRadius(
        {
          lat: 32.02119878251853,
          lng: 34.74333323660794,
        },
        false
      );
      console.log(pointsInRaduis);
      let newMapimages = {};
      for (let pointId of Object.keys(pointsInRaduis.payload)) {
        let quadId =
          pointsInRaduis.payload[pointId].location.lat.toFixed(2) +
          ":" +
          pointsInRaduis.payload[pointId].location.lng.toFixed(2);
        console.log(quadId);
        const image = await getPointImageByPointId(pointId, quadId);
        console.log(image.payload);
        if (image.payload?.src) {
          newMapimages[pointsInRaduis.payload[pointId].data.icon] =
            image.payload.src;
        }
      }
      setMapImages(newMapimages);
      setAvatars(avatarsImagesdata || {});
      setImages(Object.assign({}, ...newImages));
      setFriend(loginData);
      setUser(loginData);
      setPosts(postsData.payload);
      setChats(chatData.payload);
      setFriendChats(chatData.payload);
      setFriendPosts(postsData.payload);
      setPoints(pointsObject.payload);

      if (loginData.location) {
        const newsData = await getNewsAction(loginData.location);
        setNews(newsData);
      }

      navigate(`/${loginData.username}`);
      // await auth.setUserFull(loginData.payload);
    } catch (error) {
      console.error("Error", error);
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
          value={loginF}
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
          onClick={async () => await tryLogin()}
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
