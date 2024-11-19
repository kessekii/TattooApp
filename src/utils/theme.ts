export const lightTheme = {
  navbar: {
    background: "#d1d9e0", // Light gray-blue for a clean and modern navbar background.
    border: "#d1d9e0", // A subtle light border to give the navbar definition.
  },
  icons: {
    color: "#2c3e50", // Dark blue-gray for good contrast with light backgrounds.
  },
  popup: {
    background: "#ffffff", // Pure white for popups to contrast with the navbar.
    text: "#2c3e50", // Dark blue-gray for readable text in popups.
  },
  background: "#f7f9fb", // Very light gray for the background to avoid stark white.
  text: "#2c3e50", // Dark blue-gray for main text, easy to read on a light background.
  buttonBackground: "#d1d9e0", // Light gray for buttons to contrast against the background.
  buttonText: "#2c3e50", // Dark text on buttons for readability.
  border: "#b0bcc6",
  accent: "#42a3ff", // A medium gray-blue for borders to maintain subtlety and structure.
  fontFamily: 'Arial, sans-serif',
};

export const darkTheme = {
  navbar: {
    background: "#3b4a54", // A dark blue-gray for a sleek navbar background.
    border: "#34495e", // A slightly lighter gray-blue to give the navbar a subtle border.
  },
  icons: {
    color: "#ecf0f1", // Off-white for contrast with dark backgrounds.
  },
  popup: {
    background: "#34495e", // A slightly lighter background for popups to stand out.
    text: "#ecf0f1", // Soft white for readable text in popups.
  },
  background: "#1a1a1a", // Almost black, but not pure black to reduce eye strain.
  text: "#f8f9fa", // A light grayish white for text that's easy on the eyes.
  buttonBackground: "#3b4a54", // A darker gray with a hint of blue for buttons to make them stand out.
  buttonText: "#f8f9fa", // Off-white for high contrast on buttons.
  border: "#5e6f7a", // Subtle grayish-blue for borders to maintain the dark theme.
  accent: "#ffc342",
  fontFamily: 'Arial, sans-serif',
};
const theme = {
  
  lightTheme: lightTheme,
  darkTheme: darkTheme,
};

export default theme;
