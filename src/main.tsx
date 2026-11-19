import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { LanguageProvider } from "./lib/language";
import "./styles.css";
import "@fontsource-variable/cormorant-garamond/wght.css";
import "@fontsource-variable/cormorant-garamond/wght-italic.css";
import "@fontsource-variable/eb-garamond/wght.css";
import "@fontsource-variable/eb-garamond/wght-italic.css";
import "@fontsource/ibm-plex-mono/400.css";

const app = (
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>
);
const root = document.getElementById("root")!;
const currentPath = window.location.pathname.replace(/\/$/, "") || "/";
if (root.dataset.prerenderPath === currentPath && !window.location.search) hydrateRoot(root, app);
else createRoot(root).render(app);
