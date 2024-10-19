import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Box } from '@mui/material';
import { Home, Search, Explore, FavoriteBorder, AccountCircle } from '@mui/icons-material';
import { Outlet, useNavigate } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import { useTheme } from '../state/providers/themeProvider';
import { NavContainer, NavIcons } from './NavBarComponents';
import { EditButton, PopupContent, PopupOverlay } from '../pages/masterspage/masterPage';



// Styled components using your custom theme
const SettingsPopupComponent = ({ onClose, toggleTheme, isDarkMode, }) => {
  const { themevars } = useTheme()
  return (
    <PopupOverlay>
      <PopupContent theme={themevars}>
        <h2>Settings</h2>
        <p>Choose a theme:</p>
        <EditButton onClick={toggleTheme}>
          {isDarkMode ? "Switch to Light Theme" : "Switch to Dark Theme"}
        </EditButton>
        <br />
        <EditButton onClick={() => onClose(false)}>Close</EditButton>
      </PopupContent>
    </PopupOverlay >
  );
};

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const { theme, themevars, toggleTheme } = useTheme()
  const [openSettings, setOpenSettings] = useState(false)
  const handleNavigation = (path: string) => {
    navigate(path);
  };






  return (
    <div style={{
      background: themevars.background,
      position: 'fixed',
      display: "flex",
      justifyContent: "center",
      alignItems: "top", height: '100vh', width: '100vw', margin: "auto", top: 0, left: 0,
    }}>
      <NavContainer theme={themevars}>
        <Toolbar >
          <NavIcons theme={themevars}>
            <IconButton onClick={() => handleNavigation('/')}>
              <Home style={{ color: themevars.icons.color }} />
            </IconButton>
            <IconButton onClick={() => handleNavigation('/map')}>
              <Search style={{ color: themevars.icons.color }} />
            </IconButton>
            <IconButton onClick={() => handleNavigation('/news')}>
              <Explore style={{ color: themevars.icons.color }} />
            </IconButton>
            <IconButton onClick={() => handleNavigation('/notifications')}>
              <FavoriteBorder style={{ color: themevars.icons.color }} />
            </IconButton>
            <IconButton onClick={() => handleNavigation('/profile')}>
              <AccountCircle style={{ color: themevars.icons.color }} />
            </IconButton>
            <IconButton onClick={() => setOpenSettings(true)}>
              <AccountCircle style={{ color: themevars.icons.color }} />
            </IconButton>

          </NavIcons>
        </Toolbar>
      </NavContainer>
      {
        openSettings &&
        <SettingsPopupComponent onClose={setOpenSettings} toggleTheme={toggleTheme} isDarkMode={theme == 'light'} />
      }
      <Outlet />
    </div >
  );
};

export default NavBar;