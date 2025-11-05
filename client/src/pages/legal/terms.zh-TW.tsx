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
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{termsContent}</ReactMarkdown>
    </LegalLayout>
  );
}
