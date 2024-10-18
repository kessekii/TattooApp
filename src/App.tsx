import { LicenseInfo } from "@mui/x-license-pro";
import React, { useEffect, useState } from "react";
import {
  Route,
  Router,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import "./App.css";
import { useActions } from "./hooks/useActions";
import { useTypedSelector } from "./hooks/useTypedSelector";
import ResponsiveDrawer from "./navigation/NavBar";

import { getLogsAction } from "./state/action-creators";
import { fetchData } from "./utils/helpers/navigationHelper";
import NotLogged from "./utils/NotLogged";

import { Loading } from "./assets/svg/loading";
import Login from "./pages/login/loginPage";
import NewsPage from "./pages/news/newsPage";
import SettingsPage from "./pages/settings/settingsPage";
import PersonalSettingsPage from "./pages/settings/personalPage";
import ProtectedRoutes from "./utils/routes";
import NotFound from "./pages/notfound/NotFound";
import NewStreamPage from "./pages/stream/newStreamPage";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import BottomNav from "./pages/settings/personalPage";
import { HomePage } from "./pages/settings/home";
import { PersonalPage } from "./pages/settings/personal";
import RegisterPage from "./pages/register/registerPage";

export const worker = new Worker(
  new URL("./workers/cdn.worker.ts", import.meta.url),
  {
    type: "module",
  }
);

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
  const [errorMessage, setErrorMessage] = useState(null);
  const [isErrorPromptOpened, setIsErrorPromptOpened] = useState(false);
  const [isSuccessPromptOpened, setIsSuccessPromptOpened] = useState(false);
  const [isWarningPromptOpened, setIsWarningPromptOpened] = useState(false);
  const [onWarningAgree, setOnWarningAgree] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [firstLoading, setFirstLoading] = useState(false);
  const [presetSearch, setPresetSearch] = useState<string>("");
  const [viewRecord, setViewRecord] = useState<any>(null);
  const [isPreviewOpened, setIsPreviewOpened] = useState(false);
  const [universalEdit, setUniversalEdit] = useState<any>(null);
  const [universalDelete, setUniversalDelete] = useState<any>(null);
  const [PopUpVisible, setPopUpVisible] = useState(false);
  const [forcedFilterStatus, setForcedFilterStatus] = useState(1);

  // useEffect(() => {
  // const populateData = async () => {
  // 	//we check if the user login before downloading all the sensitive data
  // 	if (login && login.user && login.user.token) {
  // 		setLoading(true)
  // 		await fetchData(login, usersAction, users.users)
  // 		await fetchData(login, getNewsAction, news.news)
  // 		await fetchData(login, getAdvertiserAction, advertiser.advertiser)
  // 		await fetchData(login, getPublisherAction, publisher.publisher)
  // 		await fetchData(login, getCampaignAction, campaign.campaign)
  // 		await fetchData(login, getAppsAction, app.app)
  // 		await fetchData(login, getLogsAction, logs.logs)
  // 		await fetchData(login, getPasswordsAction, passwords)
  // 		await fetchData(login, getDashboardAction, dashboard)
  // 		await fetchData(
  // 			login,
  // 			getCampaignHistoryAction,
  // 			campaign_history.campaign_history,
  // 		)
  // 		await fetchData(
  // 			login,
  // 			() => getAvatars(headers, users.users),
  // 			avatars.avatars,
  // 		)
  // 		setLoading(false)
  // 	}
  // }
  // populateData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  useEffect(() => {
    if (errorMessage !== null) {
      setIsErrorPromptOpened(true);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (viewRecord !== null) {
      setIsPreviewOpened(true);
    }
  }, [viewRecord]);

  useEffect(() => {
    return () => {
      if (isPreviewOpened) {
        setUniversalDelete(null);
        setUniversalEdit(null);
      }
    };
  }, [isPreviewOpened]);
  const checkAmountOfSlashes = (string: string) => {
    let result = 0;
    for (const letter of string) {
      if (letter === "/") {
        result++;
      }
    }
    return result;
  };
  useEffect(() => {
    const handleBackButton = () => {
      //we check the amount of / because if we have more than 1 it means we are going to a page that needs popUpVisible.
      if (checkAmountOfSlashes(window.location.pathname) >= 2) {
        setPopUpVisible(true);
      } else {
        setPopUpVisible(false);
      }
    };

    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, []);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/notlogged" element={<NotLogged />} />
        <Route path="*" element={<NotFound />} />
        <Route element={<ProtectedRoutes />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/map" element={<HomePage />} />
        <Route path="/settings" element={<PersonalPage />} />
        <Route path="/profile" element={<PersonalPage />} />
        <Route path="/notifications" element={<PersonalPage />} />
        <Route path="/more" element={<PersonalPage />} />
      </Routes>
      <BottomNav />
    </div>
  );
};

export default App;
