import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import termsContent from "@legal/jp/terms-of-service.md?raw";
import LegalLayout from "./LegalLayout";

export default function TermsJaPage() {
  return (
    <LegalLayout
      title="利用規約"
      description="ToldYou Button の利用条件、責務、権利についてご確認ください。"
      canonicalPath="/jp/legal/terms"
      current="terms"
      tagLine="法務情報"
      backLabel="ホームへ戻る"
      backHref="/jp"
      navItems={[
        { key: "terms", label: "利用規約", href: "/jp/legal/terms" },
        { key: "privacy", label: "プライバシーポリシー", href: "/jp/legal/privacy" },
      ]}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{termsContent}</ReactMarkdown>
    </LegalLayout>
  );
}
