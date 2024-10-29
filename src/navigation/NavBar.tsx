import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, IconButton, Box, Avatar } from "@mui/material";
import {
  Home,
  Search,
  Explore,
  FavoriteBorder,
  AccountCircle,
} from "@mui/icons-material";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import { useTheme } from "../state/providers/themeProvider";
import {
  AvatarContainer,
  Menu,
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
import { getChatsByUserId, getPostsByUserId, getUserById } from "../../src/hooks/useChat";

import MessageIcon from "@mui/icons-material/Message";

import { getNewsAction } from '../../src/state/action-creators'
import { dataTransferItemsToFiles } from "stream-chat-react/dist/components/ReactFileUtilities";

// Styled components using your custom theme

const NavBar = (props: { screen: any, onResize: () => void }) => {
  const [user, setUser] = useLocalStorage("user", null);
  const [news, setNews] = useLocalStorage("news", null);
  const [friend, setFriend] = useLocalStorage("friend", null);
  const [friendPosts, setFriendPosts] = useLocalStorage("friendPosts", null);
  const [friendChats, setFriendChats] = useLocalStorage("friendChats", null);
  const [posts, setPosts] = useLocalStorage("posts", null);
  const [chats, setChats] = useLocalStorage("chats", null);
  const { username, postId } = useParams();
  const [isShrunk, setIsShrunk] = useState(false);
  const [lastInteractionTime, setLastInteractionTime] = useState(Date.now());
  const { isEditing, setIsEditingProfile } = useEditing();
  const handleUserInteraction = () => {
    setLastInteractionTime(Date.now());
    if (isShrunk) {
      setIsShrunk(false); // Expand if the navbar is shrunk and there is user interaction
    }
  };

  const handleFriendClick = async (profileLink: string) => {
    const firned = (await getUserById(profileLink)).payload;
    setFriend(firned);
    setFriendPosts((await getPostsByUserId(profileLink)).payload);
    setFriendChats((await getChatsByUserId(profileLink)).payload);
    window.location.href = profileLink;
    navigate("../" + profileLink);
  };

  const navigate = useNavigate();
  const { themevars } = useTheme()

  const [openSettings, setOpenSettings] = useState(false)
  const [isOpen, setIsOpen] = useState(false);


  const toggleMenu = () => {
    setIsOpen((prevState) => !prevState);
  };

  const handleNavigation = async (path: any, userData: any = user) => {
    try {
      console.log('usrusr   : ', userData)
      if (path.includes('news') && userData && userData.location) {
        const newsData = await getNewsAction(userData.location)
        console.log("setting news => ", newsData)
        setNews(newsData)
      }


      navigate(path);

    } catch (e) {
      console.log(encodeURIComponent)
    }
  };

  const handleGoEdit = async () => {
    await setIsEditingProfile();
    navigate("/" + user.username);
  };

  useEffect(() => {
    if (isShrunk) {
      setIsOpen(false);
      // Close the menu if the navbar is shrunk
    }
    // Set a timer to shrink navbar after 5 seconds of inactivity
    const shrinkTimer = setTimeout(() => {
      if (Date.now() - lastInteractionTime >= 5000) {
        setIsShrunk(true); // Shrink the navbar
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

  useEffect(() => {
    if (username !== friend.name) {
      const data = handleFriendClick(username)
      console.log(data)
    }
  }, [])


  const SettingsPopupComponent = ({ onClose }) => {
    const { theme, themevars, toggleTheme } = useTheme();
    return (
      <PopupOverlay>
        <PopupContent theme={themevars.popup}>
          <h2>Settings</h2>
          <p>Choose a theme:</p>
          <EditButton theme={themevars} onClick={handleGoEdit}>
            Edit Profile
          </EditButton>
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
        justifyContent: "center",

        alignItems: "top",
        height: "100%",
        width: "100%",
        overflowY: 'scroll',
        overflowX: 'hidden',
        maxHeight: "100vh",
        top: 0,
        left: 0,
      }}
    >
      <NavContainer theme={themevars.navbar} isShrunk={isShrunk}>
        <Toolbar>
          <NavIcons theme={themevars} isShrunk={isShrunk}>
            <IconButton
              onClick={
                !isShrunk
                  ? () => handleNavigation("/")
                  : () => setIsShrunk(false)
              }
            >
              <Home style={{ color: themevars.icons.color }} />
            </IconButton>
            {!isShrunk && (
              <>
                <IconButton onClick={() => handleNavigation("/map")}>
                  <Search style={{ color: themevars.icons.color }} />
                </IconButton>
                <IconButton onClick={() => handleNavigation("/news")}>
                  <Explore style={{ color: themevars.icons.color }} />
                </IconButton>
                <IconButton onClick={() => handleNavigation("/notifications")}>
                  <FavoriteBorder style={{ color: themevars.icons.color }} />
                </IconButton>
                <IconButton onClick={() => handleNavigation("/chats")}>
                  <MessageIcon style={{ color: themevars.icons.color }} />
                </IconButton>

                <AvatarContainer>
                  <Avatar
                    src={user.profilePicture} // Replace with actual avatar URL
                    alt="User Avatar"
                    onClick={toggleMenu}
                  />
                  {isOpen && (
                    <Menu isopen={isOpen} theme={themevars.navbar}>
                      <MenuItem
                        theme={themevars}
                        onClick={async () => {
                          const postsData = (
                            await getPostsByUserId(user.username)
                          ).payload;
                          const chatsData = (
                            await getChatsByUserId(user.username)
                          ).payload;
                          setUser(user);
                          setFriend(user);
                          setFriendPosts(postsData);
                          setFriendChats(chatsData);
                          setPosts(postsData);
                          setChats(chatsData);
                          console.log(window.location.href);
                          if (window.location.href !== user.username) {
                            const address = window.location.href.replace(
                              "http://localhost:5173/",
                              ""
                            );
                            window.location.href =
                              "http://localhost:5173/" + user.username;
                            navigate("/" + user.username);
                          } else if (
                            window.location.href.includes(user.username)
                          ) {
                            // window.location.href = user.username;
                            navigate("/" + user.username);
                          }
                        }}
                      >
                        <FaUser /> Profile
                      </MenuItem>
                      <MenuItem
                        theme={themevars}
                        onClick={async () => {
                          await setIsEditingProfile();
                          window.location.href = user.username;
                          navigate("/" + user.username);
                        }}
                      >
                        <FaUserEdit /> Edit Profile
                      </MenuItem>
                      <MenuItem
                        theme={themevars}
                        onClick={() => setOpenSettings(true)}
                      >
                        <FaCog /> Settings
                      </MenuItem>
                    </Menu>
                  )}
                </AvatarContainer>
              </>
            )}
          </NavIcons>
        </Toolbar>
      </NavContainer>
      {openSettings && <SettingsPopupComponent onClose={setOpenSettings} />}
      <div style={{ position: 'absolute', width: '100%' }}><Outlet /></div>

    </div >
  );
};

export default NavBar;
