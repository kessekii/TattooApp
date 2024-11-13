import React, { useState, useContext } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store, persistor } from "../src/state";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ThemeToggleProvider } from "./state/providers/themeProvider";

export const queryClient = new QueryClient();

// Light and Dark Themes
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});
// Create context for managing themes

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ApolloProvider client={client}>
        <QueryClientProvider client={queryClient}>
          <ThemeToggleProvider>
            <Provider store={store}>
              <PersistGate persistor={persistor}>
                <App />
              </PersistGate>
            </Provider>
          </ThemeToggleProvider>
        </QueryClientProvider>
      </ApolloProvider>
    </BrowserRouter>
  </React.StrictMode>
);
