import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import nodePolyfills from 'rollup-plugin-polyfill-node';
import svgrPlugin from 'vite-plugin-svgr';
import wasm from 'vite-plugin-wasm';


export default defineConfig({
  plugins: [
    react(), // Ensure this is already in place if using React
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