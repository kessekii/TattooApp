import styled from 'styled-components';
import { Box } from '@mui/material';

export const NavContainer = styled.div<({ theme }) >`
  background: ${(props) => props.theme.background};
  position: fixed;
  bottom: 0;
  width: 100%;
  max-height: 60px;
  z-index: 1100;
  border-top: 1px solid  ${(props) => props.theme.border};
`;

export const NavIcons = styled(Box) <({ theme }) >`
  display: flex;
  justify-content: space-around;
  width: 100%;
`;