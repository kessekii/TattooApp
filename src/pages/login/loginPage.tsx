import { Checkbox, ThemeProvider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/LogoSmall.png";
import { useActions } from "../../hooks/useActions";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { getProfileData, loginParams } from "../../state/action-creators";
import { theme } from "../../utils/theme";
import { ForgotPasswordPopup } from "./forgotPasswordComponent";
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
import { useAuth } from "../../hooks/useAuth";
import useLocalStorage from "../../hooks/useLocalStorage";
import {
  getChatByChatId,
  getPointByQuadIdAndPointId,
} from "../../../src/hooks/useChat";

const RepositoriesList = () => {
  const auth = useAuth();
  const [loginF, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [port, setPort] = useState(2);
  const [devLink, setDevLink] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { loginAction } = useActions();
  const [user, setUser] = useLocalStorage("user", null);
  const [chats, setChats] = useLocalStorage("chats", null);

  const [points, setPoints] = useLocalStorage("points", null);
  const navigate = useNavigate();

  const batchPromisesResolver = async (i: number) => {
    try {
      const headers = {
        Authorization: "Bearer " + "AIzaSyC3zvtXPRpuYYTKEJsZ6WXync_-shMPkHM",
      };
      const batchPromises: any = [];
      for (let j = 0; j < 10; j++) {
        batchPromises.push(
          new Promise((resolve, reject) => {
            resolve(
              AxiosCustom.get(
                "http://127.0.0.1:" + (i + j) + "/",

                {
                  headers,
                }
              )
            );
          })
        );
      }
      const data = await Promise.all(batchPromises);
      console.log("data", data);
    } catch (err) {}
  };
  const tryLogin = async () => {
    loginAction(
      { username: loginF, password: password, setUser: setUser },
      setErrorMessage
    );
    await auth.login(password, loginF);
    // try {
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
    let chatsObject = await GetChatsObject();
    console.log(
      "SKJDB:KSADUB:AKBJD:KASJBDA:SJDBVABD",
      chatsObject,
      userDataUpdated
    );
    let pointsObject: any = {};
    for (let quadId of Object.keys(userDataUpdated.points)) {
      for (let pointId of userDataUpdated.points[quadId]) {
        const pointData = await getPointByQuadIdAndPointId(quadId, pointId);
        pointsObject[pointId] = pointData.payload;
      }
    }

    setUser(userDataUpdated);
    setChats(chatsObject);
    setPoints(pointsObject);
    await auth.setUserFull(userDataUpdated);

    navigate("/map");
  };
  useEffect(() => {
    if (errorMessage) {
      setIsVisible(false);
    }
  }, [errorMessage]);

  return (
    <ThemeProvider theme={theme}>
      <LoginPageWrapper>
        <TitleComponent>AI STREAMING</TitleComponent>
        <LoginWrapper>
          <Typography>{"Login to Your Account"}</Typography>
          <LoginComponent
            variant="filled"
            id="login"
            key="login-form"
            label="Username"
            placeholder="kiseki"
            inputProps={{
              style: {
                color: theme.palette.primary.main,
              },
            }}
            InputLabelProps={{
              style: {
                color: theme.palette.primary.dark,
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
                color: theme.palette.primary.main,
              },
            }}
            InputLabelProps={{
              style: {
                color: theme.palette.primary.dark,
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
                  stroke: theme.palette.primary.dark,
                  color: "white",
                }}
                color="secondary"
              />
            }
            label={<Typography style={{ fontSize: "12px" }}>{port}</Typography>}
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
          >
            Login
          </LoginButton>
        </LoginWrapper>
        {/* {errorMessage && (
          <div style={{ marginTop: "8%", color: "red" }}>
            Error: {errorMessage}
          </div>
        )} */}
        {/* <Logo>
					<img src={logo} alt='aistream' />
				</Logo> */}
        {isVisible && (
          <ForgotPasswordPopup
            isVisible
            setIsVisible={setIsVisible}
            setErrorMessage={setErrorMessage}
          ></ForgotPasswordPopup>
        )}
      </LoginPageWrapper>
    </ThemeProvider>
  );
};

export default RepositoriesList;
