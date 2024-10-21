import React from 'react';
import styled from 'styled-components';

// Styled component for the angled background
const ClippedSvgBackground = styled.div<({ background }) >`
width: 100vw;
  height: 100vh;
  background-image: ${({ background }) => background}; /* Set your background image */
  background-size: cover; /* Ensure the background covers the entire container */
  background-position: top; /* Adjust the position of the image */
  top: 0;
    right: 0;
  /* Clip-path with the desired shape (this is your SVG path) */
  clip-path: path('M 159.484 325.602 C 167.564 498.045 316.557 487.816 501.481 500.053 L 498.579 1.058 L -1.959 -8.861 L -0.728 66.909 C 79.33 68.146 148.034 81.242 159.484 325.602 Z');
  
  /* Scale the clipped content */
  transform: scaleY(0.26) scaleX(1); /* Adjust the scale as needed */
  transform-origin: top right; /* Anchor the scale to the top-right corner */
  position: absolute; 
  z-index: -1;
`;


const Backdrop = () =>
    <ClippedSvgBackground background="url('https://picsum.photos/seed/picsum/200/300')" />




export default Backdrop;
