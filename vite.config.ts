import react from "@vitejs/plugin-react";

import svgrPlugin from "vite-plugin-svgr";

export default defineConfig((mode) => {
  return {
    plugins: [
      react(), // Ensure this is already in place if using React
      svgrPlugin({
        svgrOptions: {
          icon: true,
        },
      }),
    ],
    define: {
      "process.env.GOOGLE_MAPS_API_KEY": JSON.stringify(
        "AIzaSyAGFYy06ioQhkJ1yOit5nequl-z05bNgm4"
      ),
    },
    resolve: {
      alias: {
        "@vis.gl/react-google-maps/examples.js":
          "https://visgl.github.io/react-google-maps/scripts/examples.js",
      },
    },
  };
});
import { defineConfig, loadEnv } from "vite";
