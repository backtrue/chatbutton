import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import privacyContent from "@legal/jp/privacy-policy.md?raw";
import LegalLayout from "./LegalLayout";

export default function PrivacyJaPage() {
  return (
    <LegalLayout
      title="プライバシーポリシー"
      description="ToldYou Button が収集・利用・保護する個人データと、お客様・エンドユーザーの権利についてご確認ください。"
      canonicalPath="/jp/legal/privacy"
      current="privacy"
      tagLine="法務情報"
      backLabel="ホームへ戻る"
      backHref="/jp"
      navItems={[
        { key: "terms", label: "利用規約", href: "/jp/legal/terms" },
        { key: "privacy", label: "プライバシーポリシー", href: "/jp/legal/privacy" },
      ]}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{privacyContent}</ReactMarkdown>
    </LegalLayout>
  );
}
