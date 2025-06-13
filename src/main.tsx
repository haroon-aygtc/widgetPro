import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LoadingProvider } from "./contexts/LoadingContext";
import { Toaster } from "@/components/ui/toaster";

import { TempoDevtools } from "tempo-devtools";
TempoDevtools.init();

const basename = import.meta.env.BASE_URL;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <LoadingProvider>
        <BrowserRouter basename={basename}>
          <App />
          <Toaster />
        </BrowserRouter>
      </LoadingProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
