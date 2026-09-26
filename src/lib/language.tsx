import { createContext, useCallback, useContext, useEffect, useMemo, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";

/* eslint-disable react-refresh/only-export-components -- provider and hook form one small, shared language boundary. */

export type Language = "en" | "zh";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  isChinese: boolean;
  text: (english: string, chinese: string) => string;
  localizedPath: (path: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const language: Language = location.pathname === "/zh" || location.pathname.startsWith("/zh/") ? "zh" : "en";

  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  }, [language]);

  const localizedPath = useCallback((path: string) => {
    if (!path.startsWith("/") || path.startsWith("/zh")) return path;
    if (language === "en") return path;
    return path === "/" ? "/zh" : `/zh${path}`;
  }, [language]);

  const setLanguage = useCallback((nextLanguage: Language) => {
    if (nextLanguage === language) return;

    const basePath = language === "zh"
      ? location.pathname.replace(/^\/zh(?=\/|$)/, "") || "/"
      : location.pathname;
    const nextPath = nextLanguage === "zh"
      ? basePath === "/" ? "/zh" : `/zh${basePath}`
      : basePath;
    const updateRoute = () => navigate(
      { pathname: nextPath, search: location.search, hash: location.hash },
      { replace: true },
    );

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const transitionDocument = document as Document & {
      startViewTransition?: (update: () => void) => { finished: Promise<void> };
    };

    if (reduceMotion) {
      updateRoute();
      return;
    }

    document.documentElement.classList.add("language-switching");

    if (transitionDocument.startViewTransition) {
      const transition = transitionDocument.startViewTransition(() => {
        flushSync(updateRoute);
      });
      void transition.finished.finally(() => {
        document.documentElement.classList.remove("language-switching");
      });
      return;
    }

    flushSync(updateRoute);
    window.setTimeout(() => document.documentElement.classList.remove("language-switching"), 260);
  }, [language, location.hash, location.pathname, location.search, navigate]);

  const value = useMemo<LanguageContextValue>(() => ({
    language,
    setLanguage,
    isChinese: language === "zh",
    text: (english, chinese) => language === "zh" ? chinese : english,
    localizedPath,
  }), [language, localizedPath, setLanguage]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}
