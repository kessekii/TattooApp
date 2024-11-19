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
  getPointsInRadius,
  getPostsByUserId,
  getUserById,
  getUserMapImagesByUserId,
} from "../../src/hooks/useChat";

import MessageIcon from "@mui/icons-material/Message";

import {
  getProfileData,
  getTrendingPostsByCityAction,
} from "../../src/state/action-creators";
import { dataTransferItemsToFiles } from "stream-chat-react/dist/components/ReactFileUtilities";
import { getAvatarByUserId } from "../../src/pages/masterspage/portfolioViewPage";
import { getPointImageByPointId } from "./../utils/helpers/helperFuncs";
import { delay } from "@reduxjs/toolkit/dist/utils";
import { defultLocation } from "./../../src/state";

import {
  POINTS_QUERY,
  USER_QUERY,
  IMAGES_QUERY,
  NEWS_QUERY,
  POINT_IMAGE_BY_USER_QUERY,
} from "../../src/graphQL/queries";
import { useQuery } from "@apollo/client";
import useSlice from "./../hooks/useSlice";
function timeout(delay: number) {
  return new Promise((res) => setTimeout(res, delay));
}
// Define the loading spinner animation
const Spinner = keyframes`
100%{transform: rotate(1turn);}
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

interface FetchDataType {
  type: "/news" | "/map" | "/user" | "/chats";
}

const NavBar = (props: { screen: any; onResize: () => void }) => {
  try {
    const { data: user, setUser } = useSlice("user"); // Replace useLocalStorage with useSlice
    const { data: friend, setFriend, getFriendData } = useSlice("friend");
    const {
      events: events,
      posts: newsPosts,
      getNewsDataAction,
      setNews,
    } = useSlice("news");
    const { data: posts, setPosts, getPostsByUserIdAction } = useSlice("posts");
    const {
      avatars: avatars,
      ids: ids,
      images: images,
      getImagesByImageIdsAction,
      getImageIdsByUsernameAction,
      getMapImagesByUserIdAction,
      getAvatarsAction,
    } = useSlice("images");
    const {
      data: friendPosts,
      getFriendPostsAction,
      setFriendPosts,
    } = useSlice("friendPosts");

    // const { imageIds, setImageIds } = useSlice("imageIds");
    const {
      privateChats: privateChats,
      publicChats,
      setPrivateChats,
      getPrivateChatsAction,
      getPublicChatsAction,
    } = useSlice("chats");
    // const { points, setPoints } = useSlice("points");

    const { username } = useParams();
    const dim = useWindowDimensions();
    const [isShrunk, setIsShrunk] = useState(false);
    const [isMap, setIsMap] = useState(false);
    const [isMenuAnabled, setIsMenuEnabled] = useState(false);
    const [loading, setLoading] = useLocalStorage("loading", false);
    const [screen, setScreen] = useLocalStorage("screen", {});
    const auth = useAuth();
    const { themevars } = useTheme();
    const [lastInteractionTime, setLastInteractionTime] = useState(Date.now());
    const { isEditing, setIsEditingProfile } = useEditing();

    const pointsGraphQLHook = useQuery(POINTS_QUERY, {
      variables: {
        coordOfCenter: defultLocation,
        blocked: false,
      },
    });
    const userGraphQLHook = useQuery(USER_QUERY, {
      variables: { username: user.username },
    });
    const imageGraphQLHook = useQuery(IMAGES_QUERY, {
      variables: { username: user.username },
    });
    const newsGraphQLHook = useQuery(NEWS_QUERY, {
      variables: { city: "Bat Yam", country: "Israel" },
    });
    const pointsImagesGQLHook = useQuery(POINT_IMAGE_BY_USER_QUERY, {
      variables: { username: user.username },
    });

    const handleUserInteraction = () => {
      setLastInteractionTime(Date.now());
      if (isShrunk) {
        setIsShrunk(false); // Expand if the navbar is shrunk and there is user interaction
        // setIsMenuEnabled(true);
      }
    };
    useEffect(() => {
      fetchData(user.username, { type: "/user" });
    }, [username]);
    const [hideNav, setHideNav] = useLocalStorage("hideNav", null);

    const fetchData = async (username: string, { type }: FetchDataType) => {
      try {
        if (type) {
          setLoading(true);
          setIsMap(false);
          // switch (type) {
          //   case "/news":
          //     await getNewsDataAction(user.location);

          //     setHideNav(false);

          //     setLoading(false);
          //     break;

          //   case "/user":
          //     setHideNav(false);

          //     const userData = await getFriendData(username);

          //     const imageIds = await getImageIdsByUsernameAction(username);

          //     await getImagesByImageIdsAction(imageIds["payload"]);

          //     const userposts = await getFriendPostsAction(username);

          //     setPosts(userposts["payload"].payload);
          //     setFriendPosts(userposts["payload"].payload);

          //     await getAvatarsAction(userData["payload"]);

          if (type) {
            // setLoading(true);
            setIsMap(false);
            switch (type) {
              case "/news":
                const newsData = (
                  await newsGraphQLHook.refetch({
                    city: user.location.split(",")[0],
                    country: user.location.split(",")[1],
                  })
                ).data.getNewsByGeo;

                setHideNav(false);

                setLoading(false);
                break;

              case "/user":
                setHideNav(false);

                const userGQL = (
                  await userGraphQLHook.refetch({ username: username })
                ).data.getProfileData;

                let pointsGQLu = (
                  await pointsGraphQLHook.refetch({
                    coordOfCenter: {
                      lat: 32.02119878251853,
                      lng: 34.74333323660794,
                    },
                    blocked: false,
                  })
                ).data.getPointsInRadius;

                const imageGQL = (
                  await imageGraphQLHook.refetch({ username: username })
                ).data.getAllImagesByUserPage;

                setPosts(Object.assign([], userGQL.posts));
                setFriend(userGQL);
                setFriendPosts(userGQL.posts);

                // await getAvatars(username, setAvatars);

                if (username === user.username) {
                  setUser(userGQL);
                }
                setLoading(false);

                if (userGQL.location) {
                  const newsGQL = (
                    await newsGraphQLHook.refetch({
                      city: userGQL.location.split(",")[0],
                      country: userGQL.location.split(",")[1],
                    })
                  ).data.getNewsByGeo;
                  setNews(newsGQL);
                }

                break;

              case "/chats":
                const userChatsupd = await getChatsByUserId(user.username);

                setLoading(false);
                break;

              case "/map":
                let pointsGQL = (
                  await pointsGraphQLHook.refetch({
                    coordOfCenter: {
                      lat: 32.02119878251853,
                      lng: 34.74333323660794,
                    },
                  })
                ).data.getPointsInRadius;

                // user.points = pointsGQL;
                const userMapImages = (
                  await pointsImagesGQLHook.refetch({ username: username })
                ).data.getPointImageByUser;

                setHideNav(false);
                setIsMap(true);
                setLoading(false);
                break;

              default:
                setLoading(false);
                break;
            }
          }
          setScreen(dim);
        }
      } catch (e) {
        console.log(e);
      }
    };

    const navigate = useNavigate();

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
        await fetchData(username, { type: path });

        navigate(path);
      } catch (e) {}
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
              {theme == "dark"
                ? "Switch to Light Theme"
                : "Switch to Dark Theme"}
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

          justifyContent: !hideNav ? "center" : "center",
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
          style={{
            visibility: false ? "hidden" : "visible",
          }}
          hidenav={hideNav}
          ismap={isMap}
          theme={themevars.navbar}
          isshrunk={isShrunk}
        >
          <Toolbar>
            <NavIcons theme={themevars} isshrunk={isShrunk}>
              <MenuButton
                isshrunk={!isShrunk}
                index={0}
                // style={{ position: "sticky" }}
                onClick={() => handleNavigation("/map")}
              >
                <Explore style={{ color: themevars.icons.color }} />
              </MenuButton>
              <MenuButton
                index={1}
                // style={{ position: "sticky" }}
                isshrunk={!isShrunk}
                onClick={() => handleNavigation("/news")}
              >
                <Search style={{ color: themevars.icons.color }} />
              </MenuButton>

              <MenuButton
                index={2}
                // style={{ position: "sticky" }}
                isshrunk={!isShrunk}
                onClick={() => handleNavigation("/chats")}
              >
                <MessageIcon style={{ color: themevars.icons.color }} />
              </MenuButton>
              <MenuButton
                index={3}
                // style={{ position: "sticky" }}
                isshrunk={!isShrunk}
              ></MenuButton>
              <AvatarContainer isshrunk={!isShrunk}>
                <Avatar
                  src={
                    !avatars || !avatars.length
                      ? ""
                      : avatars.find((av) => av.owner === user.username).src
                  } // Replace with actual avatar URL
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
                        handleNavigation("/" + user.username);
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
  } catch (e) {
    console.log(e);
  }
};

export default NavBar;
