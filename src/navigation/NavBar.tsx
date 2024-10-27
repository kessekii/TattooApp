import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, IconButton, Box, Avatar } from "@mui/material";
import {
  Home,
  Search,
  Explore,
  FavoriteBorder,
  AccountCircle,
} from "@mui/icons-material";
import { Outlet, useNavigate } from "react-router-dom";
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
import useLocalStorage from "../hooks/useLocalStorage";
import MessageIcon from "@mui/icons-material/Message";
import { getChatsByUserId, getPostsByUserId } from "../../src/hooks/useChat";
// Styled components using your custom theme

const NavBar = () => {
  const [user, setUser] = useLocalStorage("user", null);
  const [friend, setFriend] = useLocalStorage("friend", null);
  const [friendPosts, setFriendPosts] = useLocalStorage("friendPosts", null);
  const [friendChats, setFriendChats] = useLocalStorage("friendChats", null);
  const [posts, setPosts] = useLocalStorage("posts", null);
  const [chats, setChats] = useLocalStorage("chats", null);
  const [isShrunk, setIsShrunk] = useState(false);
  const [lastInteractionTime, setLastInteractionTime] = useState(Date.now());
  const { isEditing, setIsEditing } = useEditing();
  const handleUserInteraction = () => {
    setLastInteractionTime(Date.now());
    if (isShrunk) {
      setIsShrunk(false); // Expand if the navbar is shrunk and there is user interaction
    }
  };

  const navigate = useNavigate();
  const { theme, themevars, toggleTheme } = useTheme();
  const [openSettings, setOpenSettings] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prevState) => !prevState);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleGoEdit = () => {
    setIsEditing(true);
    navigate("/" + user.username);
  };

  useEffect(() => {
    if (isShrunk) {
      setIsOpen(false);
      console.log(user); // Close the menu if the navbar is shrunk
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
        height: "100vh",
        width: "100vw",
        margin: "auto",
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
                    <Menu isOpen={isOpen} theme={themevars.navbar}>
                      <MenuItem
                        theme={themevars}
                        onClick={async () => {
                          setUser(user);
                          setFriend(user);
                          const postsData = (
                            await getPostsByUserId(user.username)
                          ).payload;
                          const chatsData = (
                            await getChatsByUserId(user.username)
                          ).payload;
                          setFriendPosts(postsData);
                          setFriendChats(chatsData);
                          setPosts(postsData);
                          setChats(chatsData);
                          // window.location.href = user.username;

                          navigate("/" + user.username);
                        }}
                      >
                        <FaUser /> Profile
                      </MenuItem>
                      <MenuItem
                        theme={themevars}
                        onClick={() => {
                          setIsEditing(true);
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
      <Outlet />
    </div>
  );
};

export default NavBar;
