import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import {
  LANGUAGE_COOKIE_MAX_AGE,
  LANGUAGE_COOKIE_NAME,
  SUPPORTED_LANGUAGES,
  isSupportedLanguage,
  type Language,
} from "@shared/language";
import {
  buildLocalizedPath,
  getLanguageFromPath,
} from "@shared/homeMeta";

declare global {
  interface Window {
    __INITIAL_LANG__?: unknown;
  }
}

type LanguageContextValue = {
  language: Language;
  setLanguage: (lang: Language) => void;
};

const STORAGE_KEY = "toldyou.language";

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

function resolveInitialLanguage(): Language {
  if (typeof window === "undefined") {
    return "en";
  }

  const pathLang = getLanguageFromPath(window.location.pathname);
  if (pathLang) {
    return pathLang;
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && isSupportedLanguage(stored)) {
      return stored;
    }
  } catch {
    // ignore storage errors
  }

  const detected = window.__INITIAL_LANG__;
  if (isSupportedLanguage(detected)) {
    return detected;
  }

  return "en";
}

function persistLanguageToCookie(lang: Language) {
  if (typeof document === "undefined") {
    return;
  }

  const parts = [
    `${LANGUAGE_COOKIE_NAME}=${lang}`,
    "path=/",
    `max-age=${LANGUAGE_COOKIE_MAX_AGE}`,
    "SameSite=Lax",
  ];

  const isSecure = typeof window !== "undefined" && window.location.protocol === "https:";
  if (isSecure) {
    parts.push("Secure");
  }

  document.cookie = parts.join("; ");
}

function persistLanguageToStorage(lang: Language) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // ignore storage errors
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => resolveInitialLanguage());

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
    }
  }, [language]);

  useEffect(() => {
    persistLanguageToCookie(language);
    persistLanguageToStorage(language);
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    if (!SUPPORTED_LANGUAGES.includes(lang)) {
      return;
    }

    setLanguageState(lang);

    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      const newPath = buildLocalizedPath(url.pathname, lang);
      if (newPath !== url.pathname) {
        url.pathname = newPath;
      }
      window.history.replaceState({}, "", url.toString());
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const syncLanguageWithPath = () => {
      const pathLang = getLanguageFromPath(window.location.pathname);
      if (pathLang && pathLang !== language) {
        setLanguageState(pathLang);
      }
    };

    syncLanguageWithPath();
    window.addEventListener("popstate", syncLanguageWithPath);

    return () => {
      window.removeEventListener("popstate", syncLanguageWithPath);
    };
  }, [language]);

  const value = useMemo<LanguageContextValue>(() => ({ language, setLanguage }), [language, setLanguage]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
