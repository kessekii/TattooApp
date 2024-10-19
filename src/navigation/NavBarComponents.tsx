import styled, { keyframes } from 'styled-components';
import { Box } from '@mui/material';


const flipIn = keyframes`
  0% {
    transform: rotateX(-90deg) translateY(60px);
    opacity: 0;
  }
  100% {
    transform: rotateX(0deg) translateY(0px);;
    opacity: 1;
  }
`;

const flipOut = keyframes`
  0% {
    transform: rotateX(0deg);
    opacity: 1;
  }
  100% {
    transform: rotateX(-90deg);
    opacity: 0;
  }
`;

export const NavContainer = styled.div<{ theme: any, isShrunk: boolean }>`
  background: ${(props) => props.theme.background};
  position: fixed;
  bottom: 0;
  width: ${(props) => (props.isShrunk ? '60px' : '80%')}; /* Shrinks to 60px width when inactive */
  max-height: 60px;
  z-index: 1100;
  border-radius: 25px;
  margin-bottom: 25px;
  margin-inline: 25px; 
  border-top: 1px solid  ${(props) => props.theme.border};
  transition: width 0.3s ease; /* Smooth transition when shrinking */
`;

export const NavIcons = styled(Box) <{ theme: any, isShrunk: boolean }>`
  display: flex;
  justify-content: ${(props) => (props.isShrunk ? 'center' : 'space-around')}; /* Icons centered when shrunk */
  width: 100%;
  transition: justify-content 0.3s ease; /* Smooth transition for icons */
`;

export const AvatarContainer = styled.div`
  position: relative;
`;

export const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
`;

export const Menu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  bottom: 60px;
  right: -40px;
  width: 130px;
  background-color: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  
  animation: ${({ isOpen }) => (isOpen ? flipIn : flipOut)} 0.6s ease-in-out forwards;
  transform-origin: top;
`;

export const MenuItem = styled.button`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: transparent;
  border: none;
  color: ${({ theme }) => theme.text};
  padding: 10px;
  cursor: pointer;
  font-size: 16px;
  border-radius: 5px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.border};
  }

  & svg {
    margin-right: 8px;
  }
`;