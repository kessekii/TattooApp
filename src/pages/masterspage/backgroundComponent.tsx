import React from "react";
import useLocalStorage from "../../hooks/useLocalStorage";
import styled from "styled-components";

const lerp = (value, minWidth, maxWidth, minValue, maxValue) => {
  const clampedValue = Math.min(Math.max(value, minWidth), maxWidth); // Clamp the value within the range
  return (
    minValue +
    (maxValue - minValue) * ((clampedValue - minWidth) / (maxWidth - minWidth))
  );
};

// Styled component for the angled background
const ClippedSvgBackground = styled.div<{ background; scale }>`
  width: 100vw;
  height: 100vh;
  background-image: url(${({ background }: any) =>
    background}); /* Set your background image */
  background-size: cover; /* Ensure the background covers the entire container */
  background-position: top; /* Adjust the position of the image */
  top: 0;
  left: 0;
  /* Clip-path with the desired shape (this is your SVG path) */
  clip-path: path(
    "M 159.484 325.602 C 167.564 498.045 316.557 487.816 501.481 500.053 L 498.579 1.058 L -1.959 -8.861 L -0.728 66.909 C 79.33 68.146 148.034 81.242 159.484 325.602 Z"
  );

  /* Scale the clipped content */
  transform: scaleY(0.26) scaleX(${({ scale }: any) => scale}); /* Adjust the scale as needed */
  transform-origin: top left; /* Anchor the scale to the top-right corner */
  position: absolute;
  z-index: 0;
`;

const Backdrop = (props: { screen: any, backdropImage: any }) => {
  if (props.screen && props.backdropImage) {

    const scale = lerp(screen.width, 375, 1800, 0.99, 3.5);

    return (
      <ClippedSvgBackground
        background={props.backdropImage}
        scale={scale}
      />
    );
  } else {
    return <></>;
  }
};

export default Backdrop;
