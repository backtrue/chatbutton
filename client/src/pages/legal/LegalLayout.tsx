import { type ReactNode, useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { key: "terms" as const, label: "使用者條款", href: "/legal/terms" },
  { key: "privacy" as const, label: "隱私權政策", href: "/legal/privacy" },
];

type LegalLayoutProps = {
  title: string;
  description: string;
  canonicalPath: string;
  current: (typeof navItems)[number]["key"];
  children: ReactNode;
};

function updateMetaTag(name: string, content: string) {
  if (typeof document === "undefined") {
    return;
  }
  let tag = document.querySelector(`meta[name="${name}"]`) as
    | HTMLMetaElement
    | null;
  if (!tag) {
    tag = document.createElement("meta");
    tag.name = name;
    document.head.appendChild(tag);
  }
  tag.content = content;
}

function updateCanonicalLink(path: string) {
  if (typeof document === "undefined") {
    return;
  }
  let linkTag = document.querySelector("link[rel=canonical]") as
    | HTMLLinkElement
    | null;
  if (!linkTag) {
    linkTag = document.createElement("link");
    linkTag.rel = "canonical";
    document.head.appendChild(linkTag);
  }

  if (typeof window !== "undefined") {
    const url = new URL(path, window.location.origin);
    linkTag.href = url.toString();
  } else {
    linkTag.href = path;
  }
}

export function LegalLayout({
  title,
  description,
  canonicalPath,
  current,
  children,
}: LegalLayoutProps) {
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.title = `${title} | ToldYou Button`;
    }

    updateMetaTag("description", description);
    updateCanonicalLink(canonicalPath);
  }, [title, description, canonicalPath]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">ToldYou Button</h1>
              <p className="text-sm text-muted-foreground mt-1">
                法務條款與政策
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              asChild
              data-testid="button-legal-back-home"
            >
              <Link href="/">
                <ArrowLeft className="w-4 h-4" />
                返回首頁
              </Link>
            </Button>
          </div>

          <nav className="flex items-center gap-3 text-sm font-medium">
            {navItems.map((item) => (
              <Link key={item.key} href={item.href} className="group">
                <span
                  className={`px-3 py-2 rounded-md transition-colors ${
                    current === item.key
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                  data-testid={`link-legal-${item.key}`}
                >
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">
        <article className="prose prose-neutral max-w-none bg-white shadow-sm rounded-lg p-8">
          {children}
        </article>
      </main>
    </div>
  );
}

export default LegalLayout;
