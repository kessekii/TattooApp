import { LicenseInfo } from "@mui/x-license-pro";
import React, { useEffect, useState } from "react";
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useMatch,
  useNavigate,
  useParams,
} from "react-router-dom";

import { useTypedSelector } from "./hooks/useTypedSelector";
import ResponsiveDrawer from "./navigation/NavBar";

import NotLogged from "./utils/NotLogged";
import Login from "./pages/login/loginPage";
import NewsPage from "./pages/news/newsPage";
import ProtectedRoutes from "./utils/routes";
import NotFound from "./pages/notfound/NotFound";
import NewStreamPage from "./pages/stream/newStreamPage";
import ProfilePageComponent from "./pages/masterspage/masterPage";
import PortfolioViewPage from "./pages/masterspage/portfolioViewPage";
import PortfolioEditorPage from "./pages/masterspage/portfolioEditorPage";

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

import { MapPage } from "./pages/map/map";
import RegisterPage from "./pages/register/registerPage";
import NewsFeed from "./pages/news/newsPage";
import { createGlobalStyle, keyframes, styled } from "styled-components";
import { useTheme, useWindowDimensions } from "./state/providers/themeProvider";
import useLocalStorage from "./hooks/useLocalStorage";

import { ChatsPageComponent } from "./pages/chatspage/chatsPagge";
import { getNewsAction, getProfileData } from "./state/action-creators";
import {
  getChatsByUserId,
  getPointsInRadius,
  getPostsByUserId,
} from "./hooks/useChat";
import { useAuth } from "./hooks/useAuth";
import useSlice from "./hooks/useSlice";
import EventViewComponent from "./pages/event/eventPage";

export const GlobalStyle = createGlobalStyle<{ theme; children }>`
root {
  background: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text};
  font-family: 'Arial', sans-serif;
  height: 100vh;
  width: 100vw;
 transition: background-color 0.3s ease; /* Smooth transition when theme changes */
}
`;

export const GlobalStyled = createGlobalStyle<{ theme }>`
body {
 
  background: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text};
  font-family: 'Arial', sans-serif;
  height: 100vh;
  width: 100vw;
  transition: background-color 0.3s ease; /* Smooth transition when theme changes */
}
`;

const Spinner = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  z-index: 1000;
`;

const Loader = styled.div`
  border: 8px solid #f3f3f3;
  border-top: 8px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: ${Spinner} 1s linear infinite;
`;

const firebaseConfig = {
  apiKey: "AIzaSyC3zvtXPRpuYYTKEJsZ6WXync_-shMPkHM",
  authDomain: "streamingai-33a74.firebaseapp.com",
  projectId: "streamingai-33a74",
  storageBucket: "streamingai-33a74.appspot.com",
  messagingSenderId: "587610037332",
  appId: "1:587610037332:web:b1c2dc324a0bc8c591a1c1",
  measurementId: "G-EGK745P33M",
};
const app = initializeApp(firebaseConfig, "streaminai");

export const auth = getAuth(app);
export const firestore = getFirestore(app, "streaminai");

const App: React.FC = () => {
  // Example: Trigger loading during data fetch

  // const { login, user } = useTypedSelector((state) => state);
  const { themevars } = useTheme();
  const { data: user, setUser } = useSlice("user");

  const [screen, setScreen] = useLocalStorage("screen", {});

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleResize = () => {
    setScreen(window.innerWidth, window.innerHeight);
  };

  const ProtectedRoute = ({ isAllowed, redirectPath, children }: any) => {
    if (!isAllowed) {
      return <Navigate to={redirectPath} />;
    }
    return children ? children : <Outlet />;
  };

  // useEffect(() => {
  //   if (errorMessage !== null) {
  //     setIsErrorPromptOpened(true);
  //   }
  // }, [errorMessage]);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/notlogged" element={<NotLogged />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoutes />}>
        <Route
          element={<ResponsiveDrawer screen={screen} onResize={handleResize} />}
        >
          {/* NewStreamPage Route
          <Route
            path="/newstream"
            element={
              <ProtectedRoute redirectPath="/login" isAllowed={user[0] && user[0].id && user[0].id}>
                <NewStreamPage />
              </ProtectedRoute>
            }
          /> */}
          <Route path="/map" element={<MapPage />} />
          {/* Dynamic Route for Username Pages */}
          <Route
            path="/:username"
            element={
              <ProtectedRoute redirectPath="/login" isAllowed={!!user}>
                <ProfilePageComponent theme={themevars} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chats"
            element={
              <ProtectedRoute redirectPath="/chats" isAllowed={!!user}>
                <ChatsPageComponent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chats/:chatId"
            element={
              <ProtectedRoute redirectPath="/chats" isAllowed={!!user}>
                <ChatsPageComponent />
              </ProtectedRoute>
            }
          />
          {/* Portfolio Editor for a specific user */}
          <Route
            path="/:username/portfolioeditor"
            element={
              <ProtectedRoute redirectPath="/login" isAllowed={!!user}>
                <PortfolioEditorPage />
              </ProtectedRoute>
            }
          />

          {/* Portfolio Viewer for a specific user */}
          <Route
            path="/:username/portfolio"
            element={
              <ProtectedRoute redirectPath="/login" isAllowed={!!user}>
                <PortfolioViewPage />
              </ProtectedRoute>
            }
          />

          {/* Specific Post in the Portfolio */}
          <Route
            path="/:username/portfolio/post/:postId"
            element={
              <ProtectedRoute redirectPath="/login" isAllowed={!!user}>
                {/* Replace with your component to view a specific post */}
                <div>Viewing Post {useParams().postId}</div>
              </ProtectedRoute>
            }
          />

          {/* News Route */}
          <Route
            path="/news"
            element={
              <ProtectedRoute redirectPath="/login" isAllowed={!!user}>
                <NewsFeed />
              </ProtectedRoute>
            }
          />
          <Route
            path=":username/event/:eventid"
            element={
              <ProtectedRoute redirectPath="/login" isAllowed={!!user}>
                < EventViewComponent />
              </ProtectedRoute>
            }
          />

        </Route>
      </Route>
    </Routes>
  );
};

export default App;
