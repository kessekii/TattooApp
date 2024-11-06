import styled, { keyframes } from "styled-components";
import { Box, IconButton } from "@mui/material";

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
const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  20% {
    opacity: 0.1;
  }
  30% {
    opacity: 0.2;
  }
  40% {
    opacity: 0.35;
  }
  60% {
    opacity: 0.7;
  }
  70% {
    opacity: 0.8;
}
  80% {
    opacity: 0.9;
  }
  100% {
    opacity: 1;
  }
`;
const fadeOut = keyframes`

  0% {
    opacity: 1;
  }
  20% {
    opacity: 0.9;
  }
  30% {
    opacity: 0.8;
  }
  40% {
    opacity: 0.7;
  }
  60% {
    opacity: 0.35;
  }
  70% {
    opacity: 0.2;
}
  80% {
    opacity: 0.1;
  }
  100% {
    opacity: 0;
  }
`;
const positionChange = keyframes`
  0% {
    position: absolute;
  }
  100% {
    position: sticky;
  }
`;
const positionChangeBack = keyframes`
  0% {
    position: sticky;
  }
  100% {
    position: absolute;
  }
`;

const marginChange = keyframes`
  0% {
    margin-inline: 40vw;
  }
  100% {
    margin-inline: 20vw;
  }
`;
const marginChangeBack = keyframes`
  0% {
    margin-inline: 20vw;
  }
  100% {
    margin-inline: 40vw;
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

const transIn = keyframes`
0% {
  border: 5px solid #8dadec00;
 
  
}
100% {
  
  border: 5px solid #8dadec;
}
`;

const transOut = keyframes`
  0% {
   
    border: 5px solid #8dadec;
  }
  100% {
    
    border: 5px solid #8dadec00;
  }
`;

export const NavContainer = styled.div<{
  hideNav: boolean;
  theme: any;
  isShrunk: boolean;
  isMap: boolean;
}>`
  background: ${(props) => props.theme.background};
  transform-origin: center;
  position: fixed;
  bottom: 10px;
  -webkit-background-clip: padding-box;
  background-clip: padding-box;
  border-width: 5px;
  border-color: #8dadec;
  visibility: ${({ hideNav }) => (hideNav ? "hidden" : "visible")};
  width: ${(props) =>
    props.isShrunk ? "4vw" : "68vw"}; /* Shrinks to 60px width when inactive */
  max-height: 60px;
  min-width: 60px;
  z-index: 1100;
  animation: ${({ isMap }) => (isMap ? transIn : transOut)} 0.6s ease;
  border-radius: 25px;

  transition: all 0.9s ease;
`;

export const NavIcons = styled(Box)<{ theme: any; isShrunk: boolean }>`
  display: flex;
  justify-content: ${(props) =>
    props.isShrunk
      ? "space-around"
      : "space-around"}; /* Icons centered when shrunk */
  width: 100%;

  transition: justify-content 1s ease; /* Smooth transition for icons */
`;

export const AvatarContainer = styled.div<{ isShrunk: boolean }>`
  position: fixed;
  margin-left: ${({ isShrunk }) => (isShrunk ? "50vw" : "0vw")};
  transition: ${({ isShrunk }) =>
    isShrunk ? "margin-left 1s ease-in-out" : "margin-left 0.6s ease"};
`;

export const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
`;

export const Menu = styled.div<{ isopen: boolean }>`
  position: absolute;
  bottom: 60px;
  right: -40px;
  width: 130px;
  background-color: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 10px;

  display: flex;
  flex-direction: column;
  animation: ${({ isopen }) => (isopen ? fadeIn : fadeOut)}
    ${({ isopen }) => (isopen ? 0.2 + "s ease-in" : 0.2 + "s ease-out")}
    forwards;
  transform-origin: top;
`;
export const MenuButton = styled(IconButton)<{
  isShrunk: boolean;
  index: number;
}>`
  background-color: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 50%;
  padding: unset;
  justify-content: space-between;

  animation: ${({ isShrunk }) => (isShrunk ? fadeIn : fadeOut)}
    ${({ isShrunk, index }) =>
      isShrunk
        ? 1.2 + index * 0.4 + "s ease-out"
        : 0.1 + (4 - index) * 0.1 + "s ease-in"}
    forwards;
`;

export const MenuItem = styled.button<{ isopened; index }>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.text};
  padding: 10px;
  cursor: pointer;
  font-size: 16px;
  border-radius: 5px;
  transition: all 0.7s ease;
  animation: ${({ isopened }) => (isopened ? fadeIn : fadeOut)}
    ${({ isopened, index }) =>
      isopened
        ? 0.1 + index * 0.15 + "s ease-in"
        : 0.1 + (4 - index) * 0.15 + "s ease-out"}
    forwards;
  &:hover {
    background-color: ${({ theme }) => theme.border};
  }

  & svg {
    margin-right: 8px;
  }
`;
