import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import privacyContent from "@legal/zh-TW/privacy-policy.md?raw";
import LegalLayout from "./LegalLayout";

export default function PrivacyZhTWPage() {
  return (
    <LegalLayout
      title="隱私權政策"
      description="瞭解 ToldYou Button 如何蒐集、使用與保護個人資料，以及您可以行使的權利。"
      canonicalPath="/legal/privacy"
      current="privacy"
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{privacyContent}</ReactMarkdown>
    </LegalLayout>
  );
}
