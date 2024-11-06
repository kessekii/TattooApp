import React, { useEffect, useMemo, useState } from "react";
import { AppBar, Toolbar, IconButton, Box, Avatar } from "@mui/material";
import {
  Home,
  Search,
  Explore,
  FavoriteBorder,
  AccountCircle,
} from "@mui/icons-material";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import {
  useTheme,
  useWindowDimensions,
} from "../state/providers/themeProvider";
import {
  AvatarContainer,
  Menu,
  MenuButton,
  MenuItem,
  NavContainer,
  NavIcons,
} from "./NavBarComponents";
import {
  EditButton,
  PopupContent,
  PopupOverlay,
} from "../pages/masterspage/masterPage";
import { useEditing } from "../hooks/useEditing";
import { FaCog, FaUserEdit, FaUser } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
import { useActions } from "../hooks/useActions";
import useLocalStorage from "../hooks/useLocalStorage";
import {
  getChatsByUserId,
  getImageByImageId,
  getImageIdsByUserId,
  getPointsInRadius,
  getPostsByUserId,
  getUserById,
  getUserMapImagesByUserId,
} from "../../src/hooks/useChat";

import MessageIcon from "@mui/icons-material/Message";

import {
  getNewsAction,
  getTrendingPostsByCityAction,
} from "../../src/state/action-creators";
import { dataTransferItemsToFiles } from "stream-chat-react/dist/components/ReactFileUtilities";
import { getAvatarByUserId } from "../../src/pages/masterspage/portfolioViewPage";
import {
  getAvatars,
  getPointImageByPointId,
} from "./../utils/helpers/helperFuncs";
import { delay } from "@reduxjs/toolkit/dist/utils";
function timeout(delay: number) {
  return new Promise((res) => setTimeout(res, delay));
}
const Spinner = keyframes`

100%{transform: rotate(1turn);
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
  background: ${({ theme }) => theme.background};
  z-index: 1000;
`;

const Loader = styled.div`
  width: 50px;
  aspect-ratio: 1;
  display: grid;
  border: 8px solid #0000;
  border-radius: 50%;
  border-right-color: ${({ theme }) => theme.text};
  animation: ${Spinner} 1s linear infinite;
`;

interface fetchDataType {
  type: "/news" | "/map" | "/user" | "/chats";
}

const NavBar = (props: { screen: any; onResize: () => void }) => {
  const [user, setUser] = useLocalStorage("user", {});
  const [news, setNews] = useLocalStorage("news", null);
  const [friend, setFriend] = useLocalStorage("friend", {});
  const [images, setImages] = useLocalStorage("images", null);
  const [friendPosts, setFriendPosts] = useLocalStorage("friendPosts", null);
  const [friendChats, setFriendChats] = useLocalStorage("friendChats", null);
  const [posts, setPosts] = useLocalStorage("posts", null);
  const [mapImages, setMapImages] = useLocalStorage("mapImages", null);
  const [avatars, setAvatars] = useLocalStorage("avatars", null);
  const [imageIds, setImageIds] = useLocalStorage("imageIds", null);
  const [chats, setChats] = useLocalStorage("chats", null);
  const [newsPosts, setNewsPosts] = useLocalStorage("newsPosts", null);
  const [screen, setScreen] = useLocalStorage("screen", null);
  const { username, postId } = useParams();
  const dim = useWindowDimensions();
  const [isShrunk, setIsShrunk] = useState(false);
  const [isMap, setIsMap] = useState(false);
  const [isMenuAnabled, setIsMenuEnabled] = useState(false);
  const [loading, setLoading] = useLocalStorage("loading", false);
  const [points, setPoints] = useLocalStorage("points", {});
  const auth = useAuth();
  const [lastInteractionTime, setLastInteractionTime] = useState(Date.now());
  const { isEditing, setIsEditingProfile } = useEditing();
  const handleUserInteraction = () => {
    setLastInteractionTime(Date.now());
    if (isShrunk) {
      setIsShrunk(false); // Expand if the navbar is shrunk and there is user interaction
      // setIsMenuEnabled(true);
    }
  };
  const [hideNav, setHideNav] = useLocalStorage("hideNav", null);
  const fetchData = async (username: string, { type }: fetchDataType) => {
    setScreen(dim);

    if (type) {
      setLoading(true);
      setIsMap(false);
      switch (type) {
        case "/news":
          const newsData = await getNewsAction(user.location);

          setHideNav(false);
          setNews(newsData);
          setLoading(false);
          break;

        case "/user":
          setHideNav(false);

          const userData = (await getUserById(username)).payload;

          const imageIds = (await getImageIdsByUserId(username)).payload;

          let [avatarIds, avatarsImagesdata]: any = await getAvatars(userData);
          const nonAvatarImages = imageIds.filter(
            (e) => !avatarIds?.includes(e)
          );
          if (!avatarIds || avatarIds.length === 0) {
            avatarsImagesdata = {};
          }
          setAvatars(avatarsImagesdata);
          // let imuserAvatar = await getImageByImageId(user.profilePicture);

          let newimages = {};
          let newAvatarimages = {};

          if (avatarIds && avatarIds.length > 0) {
            // setAvatars(newAvatarimages);
            for (let imageId of nonAvatarImages) {
              const image = await getImageByImageId(imageId);

              if (image && image.payload) {
                newimages = { ...newimages, [imageId]: image.payload };
              }
            }
          }

          const newsDataNew = await getNewsAction(friend.location);
          setNews(newsDataNew);

          setFriend(userData);
          const chatData = await getChatsByUserId(userData.username);
          setFriendChats(chatData.payload);
          const postsData = await getPostsByUserId(userData.username);
          setFriendPosts(postsData.payload);

          // await getAvatars(username, setAvatars);

          if (username === user.username) {
            console.log("user", user);
            const userMapImages = await getUserMapImagesByUserId(user.username);
            console.log(userMapImages);
            setMapImages({ ...mapImages, ...userMapImages.payload });

            setPosts(postsData.payload);

            setChats(chatData.payload);
          }
          setImages(newimages);
          setLoading(false);
          break;
          return;
        case "/chats":
          const userChatsupd = await getChatsByUserId(user.username);

          setChats(userChatsupd.payload);
          setFriendChats(userChatsupd.payload);
          setLoading(false);
          break;
          return;
        case "/map":
          // const pointsData = await getPointsInRadius(user.location, false);
          // for (let point of pointsData.payload) {
          //   const image = await getPointImageByPointId(point.id);
          //   setMapImages({ ...image.payload });

          //   setPoints({ ...points, [point]: image });
          // }
          const useMapImages = await getUserMapImagesByUserId(user.username);

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
            console.log(image);
            if (image?.src) {
              newMapimages[pointsInRaduis.payload[pointId].data.icon] =
                image.src;
            }
          }
          setMapImages({ ...useMapImages.payload, ...newMapimages });
          setHideNav(false);
          setIsMap(true);
          setLoading(false);
          break;
          return;
        default:
          break;
          return;
      }
    }
  };

  useEffect(() => {
    if (username) {
      fetchData(username, { type: "/user" });
    }
  }, [username]);

  const handleFriendClick = async (profileLink: string) => {
    const firned = (await getUserById(profileLink)).payload;
    setFriend(firned);
    setFriendPosts((await getPostsByUserId(profileLink)).payload);
    setFriendChats((await getChatsByUserId(profileLink)).payload);
    //window.location.href = profileLink;
    navigate("/" + profileLink);
  };

  const navigate = useNavigate();
  const { themevars } = useTheme();

  const [openSettings, setOpenSettings] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = async () => {
    if (!isOpen) {
      setIsOpen(true);

      setIsMenuEnabled(true);
    } else {
      setIsOpen(false);
      await timeout(1000);
      setIsMenuEnabled(false);
    }
  };

  const handleNavigation = async (path: any, username: any = user) => {
    try {
      console.log(username);
      await fetchData(username, { type: path });

      navigate(path);
    } catch (e) {
      console.log(encodeURIComponent);
    }
  };

  const handleGoEdit = async () => {
    await setIsEditingProfile();
    navigate("/" + user.username);
  };

  useEffect(() => {
    if (isShrunk) {
      setIsOpen(false);
      setIsMenuEnabled(false);
      // Close the menu if the navbar is shrunk
    }
    // Set a timer to shrink navbar after 5 seconds of inactivity
    const shrinkTimer = setTimeout(() => {
      if (Date.now() - lastInteractionTime >= 5000) {
        setIsShrunk(true); // Shrink the navbar
        setIsMenuEnabled(false);
      }
    }, 5000);

    // Event listeners for user interaction
    window.addEventListener("mousemove", handleUserInteraction);
    window.addEventListener("click", handleUserInteraction);

    return () => {
      clearTimeout(shrinkTimer);
      window.removeEventListener("mousemove", handleUserInteraction);
      window.removeEventListener("click", handleUserInteraction);
    };
  }, [isShrunk]);

  const SettingsPopupComponent = ({ onClose }) => {
    const { theme, themevars, toggleTheme } = useTheme();
    return (
      <PopupOverlay>
        <PopupContent theme={themevars.popup}>
          <h2>Settings</h2>
          <p>Choose a theme:</p>

          <EditButton onClick={toggleTheme}>
            {theme == "dark" ? "Switch to Light Theme" : "Switch to Dark Theme"}
          </EditButton>
          <br />
          <EditButton onClick={() => onClose(false)}>Close</EditButton>
        </PopupContent>
      </PopupOverlay>
    );
  };

  return (
    <div
      style={{
        background: themevars.background,
        position: "fixed",
        display: "flex",

        justifyContent: !hideNav ? "center" : "end",
        alignItems: "top",
        height: "100%",
        width: "100%",
        overflowY: "scroll",
        overflowX: "hidden",
        maxHeight: "100vh",
        top: 0,
        left: 0,
        zIndex: 1000000,
      }}
    >
      <NavContainer
        // style={{
        //   visibility: false ? "hidden" : "visible",
        // }}
        hideNav={hideNav}
        isMap={isMap}
        theme={themevars.navbar}
        isShrunk={isShrunk}
      >
        <Toolbar>
          <NavIcons theme={themevars} isShrunk={isShrunk}>
            <MenuButton
              isShrunk={!isShrunk}
              index={0}
              // style={{ position: "sticky" }}
              onClick={() => handleNavigation("/map")}
            >
              <Explore style={{ color: themevars.icons.color }} />
            </MenuButton>
            <MenuButton
              index={1}
              // style={{ position: "sticky" }}
              isShrunk={!isShrunk}
              onClick={() => handleNavigation("/news")}
            >
              <Search style={{ color: themevars.icons.color }} />
            </MenuButton>

            <MenuButton
              index={2}
              // style={{ position: "sticky" }}
              isShrunk={!isShrunk}
              onClick={() => handleNavigation("/chats")}
            >
              <MessageIcon style={{ color: themevars.icons.color }} />
            </MenuButton>
            <MenuButton
              index={3}
              // style={{ position: "sticky" }}
              isShrunk={!isShrunk}
            ></MenuButton>
            <AvatarContainer isShrunk={!isShrunk}>
              <Avatar
                src={avatars[user.username]?.src} // Replace with actual avatar URL
                alt="User Avatar"
                onClick={async () => await toggleMenu()}
              />
            </AvatarContainer>

            {isMenuAnabled ? (
              <Menu
                isopen={isOpen}
                theme={themevars.navbar}
              // style={{ visibility: isOpen ? "visible" : "hidden" }}
              >
                <MenuItem
                  isopened={isOpen}
                  theme={themevars}
                  index={4}
                  onClick={
                    async () => {
                      navigate("/" + user.username);
                    }
                    // }
                  }
                >
                  <FaUser /> Profile
                </MenuItem>
                <MenuItem
                  isopened={isOpen}
                  theme={themevars}
                  index={3}
                  onClick={async () => {
                    //window.location.href = user.username;
                    navigate("/" + user.username);
                    await setIsEditingProfile();
                  }}
                >
                  <FaUserEdit /> Edit Profile
                </MenuItem>
                <MenuItem
                  isopened={isOpen}
                  index={2}
                  theme={themevars}
                  onClick={() => setOpenSettings(true)}
                >
                  <FaCog /> Settings
                </MenuItem>
                <MenuItem
                  isopened={isOpen}
                  index={1}
                  theme={themevars}
                  onClick={
                    !isShrunk
                      ? () => handleNavigation("/")
                      : () => setIsShrunk(false)
                  }
                >
                  <FaCog /> Logout
                </MenuItem>
              </Menu>
            ) : (
              <></>
            )}
          </NavIcons>
        </Toolbar>
      </NavContainer>
      {openSettings && <SettingsPopupComponent onClose={setOpenSettings} />}
      {loading && (
        <LoadingOverlay>
          <Loader theme={themevars} />
        </LoadingOverlay>
      )}
      {(!loading || isMap) && (
        <div
          style={{
            position: "absolute",
            width: "100%",
            backgroundColor: themevars.background,
          }}
        >
          <Outlet />
        </div>
      )}
    </div>
  );
};

export default NavBar;
