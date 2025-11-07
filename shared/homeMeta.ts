import { SUPPORTED_LANGUAGES, type Language } from "./language";

export const LANGUAGE_ROUTE_SEGMENTS: Record<Language, string> = {
  en: "",
  "zh-TW": "tw",
  ja: "jp",
};

export const LANGUAGE_HTML_TAG: Record<Language, string> = {
  en: "en",
  "zh-TW": "zh-Hant-TW",
  ja: "ja",
};

export const LANGUAGE_HREFLANG: Record<Language, string> = {
  en: "en",
  "zh-TW": "zh-Hant-TW",
  ja: "ja",
};

export const HOME_META: Record<Language, { title: string; description: string }> = {
  en: {
    title: "Get Your Button Free (Blazing Fast & No Sign-Up) | ToldYouButton",
    description:
      "ToldYouButton is the simply powerful free chat button. Blazing fast, no sign-up, and 1-minute setup. Connect with customers via WhatsApp & Instagram instantly. Why pay for slow, complex tools? Get your free widget now.",
  },
  "zh-TW": {
    title: "提升轉換率的客服聊天入口 | ToldYou Button",
    description:
      "想提高轉換率、降低流失？ToldYou Button 幫你在網站上打造「想聊就聊」的客服入口。安裝只要 1 行程式碼，即可快速串連 LINE、Messenger、WhatsApp 等渠道，不再錯過潛在客戶。",
  },
  ja: {
    title: "CVRを上げる、“スタッフにつながる”ボタン | ToldYouButton",
    description:
      "問い合わせ率を上げたい？離脱を減らしたい？\nToldYouボタンは、サイトに「話しかけたくなる接点」をつくる簡単導入ツール。\nわずか1行のコードで、コンバージョンを逃しません。",
  },
};

function normalizePathname(pathname: string): string {
  if (!pathname.startsWith("/")) {
    pathname = `/${pathname}`;
  }

  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }

  return pathname;
}

export function getLanguageFromPath(pathname: string): Language | null {
  const normalized = normalizePathname(pathname);

  if (normalized === "/") {
    return "en";
  }

  const [firstSegment] = normalized.split("/").filter(Boolean);

  for (const lang of SUPPORTED_LANGUAGES) {
    const segment = LANGUAGE_ROUTE_SEGMENTS[lang];
    if (segment && firstSegment === segment) {
      return lang;
    }
  }

  return null;
}

export function removeLanguagePrefix(pathname: string): string {
  const normalized = normalizePathname(pathname);

  if (normalized === "/") {
    return "/";
  }

  const segments = normalized.split("/").filter(Boolean);
  const [firstSegment, ...rest] = segments;

  for (const lang of SUPPORTED_LANGUAGES) {
    const segment = LANGUAGE_ROUTE_SEGMENTS[lang];
    if (segment && firstSegment === segment) {
      if (rest.length === 0) {
        return "/";
      }
      return `/${rest.join("/")}`;
    }
  }

  return normalized;
}

export function isHomePath(pathname: string): boolean {
  const normalized = normalizePathname(pathname);

  if (normalized === "/") {
    return true;
  }

  const segments = normalized.split("/").filter(Boolean);

  if (segments.length === 1) {
    const [first] = segments;
    return SUPPORTED_LANGUAGES.some((lang) => {
      const segment = LANGUAGE_ROUTE_SEGMENTS[lang];
      return segment && segment === first;
    });
  }

  return false;
}

export function getHomePathForLanguage(lang: Language): string {
  const segment = LANGUAGE_ROUTE_SEGMENTS[lang];
  return segment ? `/${segment}` : "/";
}

export function buildLocalizedPath(pathname: string, lang: Language): string {
  const basePath = removeLanguagePrefix(pathname);
  const segment = LANGUAGE_ROUTE_SEGMENTS[lang];

  if (!segment) {
    return basePath;
  }

  if (basePath === "/") {
    return `/${segment}`;
  }

  return `/${segment}${basePath}`;
}

export function getHomeAlternateLinks(origin: string): Array<{ href: string; hreflang: string }> {
  const links = SUPPORTED_LANGUAGES.map((lang) => ({
    hreflang: LANGUAGE_HREFLANG[lang],
    href: new URL(getHomePathForLanguage(lang), origin).toString(),
  }));

  const defaultLink = new URL(getHomePathForLanguage("en"), origin).toString();

  return [
    ...links,
    {
      hreflang: "x-default",
      href: defaultLink,
    },
  ];
}
