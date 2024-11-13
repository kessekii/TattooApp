import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useSlice from "../../hooks/useSlice";
import { LoginButton, LoginComponent, LoginWrapper, TitleComponent } from "./loginPageComponents";

const LoginPage = () => {
  const [loginF, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const { loginAction, setUser } = useSlice("user"); // Using the loginAction from the user slice

  const tryLogin = async () => {
    if (!loginF || !password) return;

    try {
      const loginData = await loginAction({ username: loginF, password }, setErrorMessage);

      if (loginData && loginData.payload) {

        // Successfully logged in
        //setUser(loginData.payload); // Set user data in the store
        navigate(`/${loginData.payload.username}`);
      } else {
        setErrorMessage("Invalid login credentials.");
      }
    } catch (error) {
      setErrorMessage("Login failed.");
    }
  };

  return (
    <LoginWrapper>
      <TitleComponent>TATTOO APP</TitleComponent>
      <LoginComponent
        label="Username"
        placeholder="Enter your username"
        value={loginF}
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
