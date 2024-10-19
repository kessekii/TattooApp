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
import { ForgotPasswordPopup } from "./forgotPasswordComponent";
import { useTheme } from "../../state/providers/themeProvider";
import { getChatByChatId, getPointByPointId } from "../../hooks/useChat";
import { getProfileData } from "../../state/action-creators";

const RepositoriesList = () => {
  const auth = useAuth();
  const { theme, themevars, toggleTheme } = useTheme(); // Access custom theme
  const [loginF, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [port, setPort] = useState(2);
  const [isVisible, setIsVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { loginAction } = useActions();
  const [user, setUser] = useLocalStorage("user", null);
  const [chats, setChats] = useLocalStorage("chats", null);

  const [points, setPoints] = useLocalStorage("points", null);
  const navigate = useNavigate();


  const tryLogin = async () => {
    loginAction(
      { username: loginF, password, setUser },
      setErrorMessage
    );
    await auth.login(password, loginF);
    await auth.setUserFull(user);
    const userDataUpdated = (await getProfileData(loginF)).payload;
    const GetChatsObject = async () => {
      let chatsObject: any = {};

      for (let chatId of Object.keys(userDataUpdated.chats)) {
        const chatData = await getChatByChatId(chatId, loginF);
        chatsObject[chatId] = chatData.payload;
      }
      return chatsObject;
    };
    if (userDataUpdated.chats && userDataUpdated.chats.length > 0) {
      let chatsObject = await GetChatsObject();
      console.log(
        "SKJDB:KSADUB:AKBJD:KASJBDA:SJDBVABD",
        chatsObject,
        userDataUpdated
      );
      let pointsObject: any = {};
      for (let pointId of Object.keys(userDataUpdated.points)) {
        const pointData = await getPointByPointId(pointId);
        pointsObject[pointId] = pointData.payload;
      }

      setUser(userDataUpdated);
      setChats(chatsObject);
      setPoints(pointsObject);
      await auth.setUserFull(userDataUpdated);

      navigate("/map");
    }
    navigate("/map");
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
        <Typography style={{ marginBottom: '20px' }}>{"Login to Your Account"}</Typography>
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
          label={<Typography style={{ fontSize: "12px" }}>Keep me logged in</Typography>}
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
          onClick={() => tryLogin()}
          style={{ marginBottom: '5px' }}
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
