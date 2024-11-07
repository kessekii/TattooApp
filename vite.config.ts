import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import nodePolyfills from 'rollup-plugin-polyfill-node';
import svgrPlugin from 'vite-plugin-svgr';
import wasm from 'vite-plugin-wasm';
import babel from "vite-plugin-babel";


const ReactCompilerConfig = {
  target: '18',
  
};

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ["babel-plugin-react-compiler", ReactCompilerConfig],
        ],
      },
    }), // Ensure this is already in place if using React
    babel({
    
      babelConfig: {
        presets: ["@babel/preset-typescript"], // if you use TypeScript
        plugins: [
          ["babel-plugin-react-compiler", ReactCompilerConfig],
        ],
      },
    }),
    svgrPlugin({
      svgrOptions: {
        icon: true,
      }
    }),
    nodePolyfills({
      include: ['events'] // Specify other Node modules here if needed
    }),
    
    wasm(),
  ],
  resolve: {
    alias: {
      events: 'events'
    }
  }
});