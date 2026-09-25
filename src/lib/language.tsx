import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

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
  const [language, setLanguage] = useState<Language>(() => {
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
