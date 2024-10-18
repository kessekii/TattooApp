import React, { useState, useContext } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { Provider } from 'react-redux'
import { store, persistor } from '../src/state'
import { PersistGate } from 'redux-persist/integration/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ThemeToggleProvider } from './state/providers/themeProvider'


export const queryClient = new QueryClient()



// Light and Dark Themes
const lightTheme = {
  background: "#fff",
  text: "#000",
  buttonBackground: "#007bff",
  buttonText: "#fff",
  border: "#ccc",
};

const darkTheme = {
  background: "#2c2f36",
  text: "#f8f9fa",
  buttonBackground: "#4e5f6a",
  buttonText: "#f8f9fa",
  border: "#5e6f7a",
};

// Create context for managing themes





const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeToggleProvider >


          <Provider store={store}>
            <PersistGate persistor={persistor}>
              <App />
            </PersistGate>
          </Provider>


        </ThemeToggleProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
)