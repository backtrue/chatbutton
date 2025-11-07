export type Language = "zh-TW" | "ja" | "en";

export const SUPPORTED_LANGUAGES: Language[] = ["zh-TW", "ja", "en"];

export const LANGUAGE_LABELS: Record<Language, string> = {
  "zh-TW": "繁體中文",
  ja: "日本語",
  en: "English",
};

export const LANGUAGE_COOKIE_NAME = "toldyou_lang";
export const LANGUAGE_COOKIE_MAX_AGE = 60 * 60 * 24 * 90; // 90 days

const BACKLINK_TRANSLATIONS: Record<Language, string> = {
  "zh-TW": "報數據",
  ja: "レポートデータ",
  en: "Report Data",
};

export function isSupportedLanguage(value: unknown): value is Language {
  return typeof value === "string" && (SUPPORTED_LANGUAGES as string[]).includes(value);
}

export function normalizeLanguage(value: unknown, fallback: Language = "en"): Language {
  return isSupportedLanguage(value) ? value : fallback;
}

export function getBacklinkText(lang: Language = "zh-TW"): string {
  return BACKLINK_TRANSLATIONS[lang] ?? BACKLINK_TRANSLATIONS["zh-TW"];
}

export function getBacklinkUrl(): string {
  return "https://thinkwithblack.com";
}

export function getLanguageOptions() {
  return SUPPORTED_LANGUAGES.map((lang) => ({
    value: lang,
    label: LANGUAGE_LABELS[lang],
  }));
}
