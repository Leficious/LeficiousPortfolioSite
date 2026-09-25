import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";

/* eslint-disable react-refresh/only-export-components -- provider and hook form one small, shared language boundary. */

export type Language = "en" | "zh";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  isChinese: boolean;
  text: (english: string, chinese: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const storageKey = "leficious-language";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === "undefined") return "en";
    try {
      return localStorage.getItem(storageKey) === "zh" ? "zh" : "en";
    } catch {
      return "en";
    }
  });

  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    try {
      localStorage.setItem(storageKey, language);
    } catch {
      // Storage can be unavailable in privacy-restricted contexts.
    }
  }, [language]);

  const setLanguage = (nextLanguage: Language) => {
    if (nextLanguage === language) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const transitionDocument = document as Document & {
      startViewTransition?: (update: () => void) => { finished: Promise<void> };
    };

    if (reduceMotion) {
      setLanguageState(nextLanguage);
      return;
    }

    document.documentElement.classList.add("language-switching");

    if (transitionDocument.startViewTransition) {
      const transition = transitionDocument.startViewTransition(() => {
        flushSync(() => setLanguageState(nextLanguage));
      });
      void transition.finished.finally(() => {
        document.documentElement.classList.remove("language-switching");
      });
      return;
    }

    flushSync(() => setLanguageState(nextLanguage));
    window.setTimeout(() => document.documentElement.classList.remove("language-switching"), 260);
  };

  const value = useMemo<LanguageContextValue>(() => ({
    language,
    setLanguage,
    isChinese: language === "zh",
    text: (english, chinese) => language === "zh" ? chinese : english,
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}
