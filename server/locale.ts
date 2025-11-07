import type { Request } from "express";
import geoip from "geoip-lite";
import {
  type Language,
  LANGUAGE_COOKIE_MAX_AGE,
  LANGUAGE_COOKIE_NAME,
  isSupportedLanguage,
} from "@shared/language";

const COUNTRY_TO_LANGUAGE: Record<string, Language> = {
  TW: "zh-TW",
  JP: "ja",
};

const DEFAULT_LANGUAGE: Language = "en";

export type LocaleDetection = {
  lang: Language;
  country: string | null;
};

function extractIpAddress(req: Request): string | undefined {
  const forwarded = req.headers["x-forwarded-for"]; // may contain list

  if (typeof forwarded === "string" && forwarded.length > 0) {
    const first = forwarded.split(",").map((value) => value.trim())[0];
    if (first) {
      return first;
    }
  } else if (Array.isArray(forwarded) && forwarded.length > 0) {
    return forwarded[0];
  }

  return req.socket?.remoteAddress ?? undefined;
}

export function detectLanguageFromRequest(req: Request): LocaleDetection {
  const ip = extractIpAddress(req);
  const lookup = ip ? geoip.lookup(ip) : null;

  if (lookup?.country && COUNTRY_TO_LANGUAGE[lookup.country]) {
    return {
      lang: COUNTRY_TO_LANGUAGE[lookup.country],
      country: lookup.country,
    };
  }

  return {
    lang: DEFAULT_LANGUAGE,
    country: lookup?.country ?? null,
  };
}

export function readLanguageCookie(cookieHeader?: string): Language | null {
  if (!cookieHeader) {
    return null;
  }

  const parts = cookieHeader.split(";");
  for (const part of parts) {
    const [name, ...rest] = part.trim().split("=");
    if (name === LANGUAGE_COOKIE_NAME) {
      const value = decodeURIComponent(rest.join("="));
      return isSupportedLanguage(value) ? value : null;
    }
  }

  return null;
}

export function buildLanguageCookie(
  lang: Language,
  options: { secure?: boolean } = {},
): string {
  const attributes = [
    `${LANGUAGE_COOKIE_NAME}=${encodeURIComponent(lang)}`,
    "Path=/",
    "SameSite=Lax",
    `Max-Age=${LANGUAGE_COOKIE_MAX_AGE}`,
  ];

  if (options.secure) {
    attributes.push("Secure");
  }

  return attributes.join("; ");
}
