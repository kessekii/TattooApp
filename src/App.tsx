import { LicenseInfo } from "@mui/x-license-pro";
import React, { useEffect, useState } from "react";
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
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

import { MapPage } from "./pages/settings/home";
import RegisterPage from "./pages/register/registerPage";
import NewsFeed from "./pages/news/newsPage";
import { createGlobalStyle, styled } from "styled-components";
import { useTheme } from "./state/providers/themeProvider";
import useLocalStorage from "./hooks/useLocalStorage";
import FriendPageComponent from "./pages/friendpage/friendPage";
import FriendPortfolioViewPage from "./pages/friendpage/portfolioViewPage";

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
  // const { login, user } = useTypedSelector((state) => state);
  // const { themevars } = useTheme()
  const [user, setUser] = useLocalStorage("user", {});
  const [friend, setFriend] = useLocalStorage("friend", {});
  const [profileData, setProfileData] = useState(user);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isErrorPromptOpened, setIsErrorPromptOpened] = useState(false);

  const ProtectedRoute = ({ isAllowed, redirectPath, children }: any) => {
    if (!isAllowed) {
      return <Navigate to={redirectPath} />;
    }
    return children ? children : <Outlet />;
  };

  useEffect(() => {
    if (errorMessage !== null) {
      setIsErrorPromptOpened(true);
    }
  }, [errorMessage]);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/notlogged" element={<NotLogged />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoutes />}>
        <Route element={<ResponsiveDrawer setIsEditingProfile={setIsEditingProfile} />}>
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
                {(Object.keys(user).length > 0 &&
                  !(Object.keys(friend).length > 0)) ||
                  (user && friend && user.username === friend.username) ? (
                  <ProfilePageComponent theme />
                ) : (
                  <FriendPageComponent theme />
                )}
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
                {(Object.keys(user).length > 0 &&
                  !(Object.keys(friend).length > 0)) ||
                  (user && friend && user.username === friend.username) ? (
                  <PortfolioViewPage />
                ) : (
                  <FriendPortfolioViewPage />
                )}
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
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
