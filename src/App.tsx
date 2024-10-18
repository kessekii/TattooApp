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
import "./App.css";
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
import { useDispatch } from "react-redux";
import { getProfileData } from "./state/action-creators";
import { get } from "video.js/dist/types/tech/middleware";
import { MapPage } from "./pages/settings/home";

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
  const { login, user } = useTypedSelector((state) => state);

  const [profileData, setProfileData] = useState(user);

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

      <Route element={<ProtectedRoutes />}>
        <Route element={<ResponsiveDrawer />}>
          {/* NewStreamPage Route */}
          <Route
            path="/newstream"
            element={
              <ProtectedRoute
                redirectPath="/login"
                isAllowed={login.user && login.user}
              >
                <NewStreamPage />
              </ProtectedRoute>
            }
          />
          <Route path="/map" element={<MapPage />} />
          {/* Dynamic Route for Username Pages */}
          <Route
            path="/:username"
            element={
              <ProtectedRoute redirectPath="/login" isAllowed={login}>
                <ProfilePageComponent
                  profileData={profileData}
                  setProfileData={setProfileData}
                />
              </ProtectedRoute>
            }
          />

          {/* Portfolio Editor for a specific user */}
          <Route
            path="/:username/portfolioeditor"
            element={
              <ProtectedRoute redirectPath="/login" isAllowed={login}>
                <PortfolioEditorPage setProfileData={setProfileData} />
              </ProtectedRoute>
            }
          />

          {/* Portfolio Viewer for a specific user */}
          <Route
            path="/:username/portfolio"
            element={
              <ProtectedRoute redirectPath="/login" isAllowed={login}>
                <PortfolioViewPage
                  profileData={profileData}
                  setProfileData={setProfileData}
                />
              </ProtectedRoute>
            }
          />

          {/* Specific Post in the Portfolio */}
          <Route
            path="/:username/portfolio/post/:postId"
            element={
              <ProtectedRoute redirectPath="/login" isAllowed={login}>
                {/* Replace with your component to view a specific post */}
                <div>Viewing Post {useParams().postId}</div>
              </ProtectedRoute>
            }
          />

          {/* News Route */}
          <Route
            path="/news"
            element={
              <ProtectedRoute
                redirectPath="/login"
                isAllowed={login.user && login.user.token}
              >
                <NewsPage
                  setErrorMessage={setErrorMessage}
                  errorMessage={errorMessage}
                  isErrorPromptOpened={isErrorPromptOpened}
                  setIsErrorPromptOpened={setIsErrorPromptOpened}
                />
              </ProtectedRoute>
            }
          />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
