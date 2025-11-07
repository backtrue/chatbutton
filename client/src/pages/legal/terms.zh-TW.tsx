import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import termsContent from "@legal/zh-TW/terms-of-service.md?raw";
import LegalLayout from "./LegalLayout";

export default function TermsZhTWPage() {
  return (
    <LegalLayout
      title="使用者條款"
      description="檢視 ToldYou Button 使用者條款，了解服務使用資格、責任與權利。"
      canonicalPath="/legal/terms"
      current="terms"
      tagLine="法務條款與政策"
      backLabel="返回首頁"
      navItems={[
        { key: "terms", label: "使用者條款", href: "/legal/terms" },
        { key: "privacy", label: "隱私權政策", href: "/legal/privacy" },
      ]}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{termsContent}</ReactMarkdown>
    </LegalLayout>
  );
}
