import { useState } from "react";
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
import useSlice from "../../../src/hooks/useSlice";

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
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const { loginAction, setUser } = useSlice("user");
  const { data: posts, setPosts } = useSlice("posts");
  const { data: friend, setFriend } = useSlice("friend");
  const { data: friendPosts, setFriendPosts } = useSlice("friendPosts");
  const {
    images: images,
    setImages,
    setMapImages,
    setAvatars,
  } = useSlice("images");
  const tryLogin = async () => {
    if (!login || !password) return;
    try {
      const userGQL = (await userGraphQLHook.refetch({ username: login })).data
        .getProfileData;

      const imageGQL = (await imageGraphQLHook.refetch({ username: login }))
        .data.getAllImagesByUserPage;

      console.log(userGQL, imageGQL);

      setUser(Object.assign({}, userGQL));
      setFriend(Object.assign({}, userGQL));

      setFriendPosts(Object.assign([], userGQL.posts));
      setPosts(Object.assign([], userGQL.posts));
      setAvatars(Object.assign([], imageGQL.avatars));
      setImages(Object.assign([], imageGQL.posts));
      setMapImages(Object.assign([], imageGQL.map));
      console.log(imageGQL);
      if (userGQL.location) {
        const newsGQL = (
          await newsGraphQLHook.refetch({
            city: userGQL.location.split(",")[0],
            country: userGQL.location.split(",")[1],
          })
        ).data.getNewsByGeo;
      }
      navigate(`/${userGQL.username}`);
      // await auth.setUserFull(loginData.payload);
    } catch (error) { }
  };

  return (
    <LoginWrapper>
      <TitleComponent>TATTOO APP</TitleComponent>
      <LoginComponent
        label="Username"
        placeholder="Enter your username"
        value={login}
        onChange={(e) => setLogin(e.target.value)}
      />
      <LoginComponent
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <LoginButton onClick={tryLogin}>Login</LoginButton>
      {errorMessage && <p>{errorMessage}</p>}
    </LoginWrapper>
  );
};

export default LoginPage;
