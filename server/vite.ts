import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";
import type { Language } from "@shared/language";
import {
  HOME_META,
  LANGUAGE_HTML_TAG,
  getHomeAlternateLinks,
  getLanguageFromPath,
  isHomePath,
} from "@shared/homeMeta";

const viteLogger = createLogger();

type InjectOptions = {
  lang: Language;
  path: string;
  origin: string;
};

function sanitizeDescription(description: string): string {
  return description.replace(/\s+\n\s+/g, " ").replace(/\s{2,}/g, " ").trim();
}

function renderAlternateLinks(origin: string): string {
  const links = getHomeAlternateLinks(origin);
  return links
    .map(({ href, hreflang }) => `    <link rel="alternate" hreflang="${hreflang}" href="${href}" />`)
    .join("\n");
}

function injectLocalizedMeta(template: string, { lang, path, origin }: InjectOptions): string {
  const resolvedLang: Language = HOME_META[lang] ? lang : "en";
  const meta = HOME_META[resolvedLang];
  const htmlLang = LANGUAGE_HTML_TAG[resolvedLang] ?? "en";
  const description = sanitizeDescription(meta.description);
  const canonicalUrl = new URL(path, origin).toString();
  const alternateMarkup = isHomePath(path) ? renderAlternateLinks(origin) : "";

  return template
    .replace(/__TOLDYOU_HTML_LANG__/g, htmlLang)
    .replace(/__TOLDYOU_META_TITLE__/g, meta.title)
    .replace(/__TOLDYOU_META_DESCRIPTION__/g, description)
    .replace(/__TOLDYOU_INITIAL_LANG__/g, resolvedLang)
    .replace(/__TOLDYOU_CANONICAL_URL__/g, canonicalUrl)
    .replace("<!--__TOLDYOU_ALTERNATE_LINKS__-->", alternateMarkup);
}

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const transformed = await vite.transformIndexHtml(url, template);
      const protocol = (req.get("x-forwarded-proto") as string | undefined) ?? req.protocol;
      const host = req.get("host") ?? "localhost";
      const origin = `${protocol}://${host}`;
      const lang = (res.locals.initialLang as Language | undefined) ?? getLanguageFromPath(req.path) ?? "en";
      const page = injectLocalizedMeta(transformed, {
        lang,
        path: req.path,
        origin,
      });
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  const indexTemplate = fs.readFileSync(path.resolve(distPath, "index.html"), "utf-8");

  app.use("*", (req, res) => {
    const protocol = (req.get("x-forwarded-proto") as string | undefined) ?? req.protocol;
    const host = req.get("host") ?? "localhost";
    const origin = `${protocol}://${host}`;
    const lang = (res.locals.initialLang as Language | undefined) ?? getLanguageFromPath(req.path) ?? "en";

    const page = injectLocalizedMeta(indexTemplate, {
      lang,
      path: req.path,
      origin,
    });

    res.status(200).set({ "Content-Type": "text/html" }).end(page);
  });
}
