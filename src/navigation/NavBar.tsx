import React from 'react';
import { AppBar, Toolbar, IconButton, Box } from '@mui/material';
import { Home, Search, Explore, FavoriteBorder, AccountCircle } from '@mui/icons-material';
import { Outlet, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useTypedSelector } from '../hooks/useTypedSelector';

// Styled components
const NavContainer = styled("div")`
  background-color: white;
  position: fixed; /* Fixed position at the bottom */
  bottom: 0; /* Stick to the bottom */
  width: 100%; /* Full width */
  
max-height: 60px;
  z-index: 1100;
  box-shadow: none;
  border-top: 1px solid #dbdbdb;
`;

const NavIcons = styled(Box)`
  display: flex;
  justify-content: space-around;
  width: 100%; /* Full width for better icon spacing on mobile */
  @media (max-width: 768px) {
    width: 100%; /* Adjust for mobile view */
  }
`;

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useTypedSelector((state) => state);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div style={{height: "auto"}}>
      {/* Navigation bar fixed at the bottom */}

      <NavContainer position="fixed">
        <Toolbar>
          <NavIcons>
            <IconButton onClick={() => handleNavigation('/')}>
              <Home style={{ color: 'black' }} />
            </IconButton>
            <IconButton onClick={() => handleNavigation('/map')}>
              <Search style={{ color: 'black' }} />
            </IconButton>
            <IconButton onClick={() => handleNavigation('/explore')}>
              <Explore style={{ color: 'black' }} />
            </IconButton>
            <IconButton onClick={() => handleNavigation('/notifications')}>
              <FavoriteBorder style={{ color: 'black' }} />
            </IconButton>
            <IconButton onClick={() => handleNavigation('/profile')}>
              <AccountCircle style={{ color: 'black' }} />
            </IconButton>
          </NavIcons>
        </Toolbar>
      </NavContainer>
	<Outlet />
      {/* Renders the content above the nav bar */}
      
    </div>
  );
};

export default NavBar;

