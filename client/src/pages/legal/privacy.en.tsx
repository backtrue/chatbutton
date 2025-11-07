import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import privacyContent from "@legal/en/privacy-policy.md?raw";
import LegalLayout from "./LegalLayout";

export default function PrivacyEnPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      description="Learn how ToldYou Button collects, uses, and protects personal data, along with your available rights."
      canonicalPath="/en/legal/privacy"
      current="privacy"
      tagLine="Legal Policies"
      backLabel="Back to Home"
      backHref="/?lang=en"
      navItems={[
        { key: "terms", label: "Terms of Service", href: "/en/legal/terms" },
        { key: "privacy", label: "Privacy Policy", href: "/en/legal/privacy" },
      ]}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{privacyContent}</ReactMarkdown>
    </LegalLayout>
  );
}
