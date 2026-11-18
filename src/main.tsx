import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { LanguageProvider } from "./lib/language";
import "./styles.css";
import "@fontsource-variable/cormorant/wght.css";
import "@fontsource-variable/cormorant/wght-italic.css";
import "@fontsource-variable/cinzel/wght.css";
import "@fontsource-variable/newsreader/opsz.css";
import "@fontsource-variable/newsreader/opsz-italic.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";

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
