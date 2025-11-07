import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import termsContent from "@legal/en/terms-of-service.md?raw";
import LegalLayout from "./LegalLayout";

export default function TermsEnPage() {
  return (
    <LegalLayout
      title="Terms of Service"
      description="Review the ToldYou Button Terms of Service to understand eligibility, responsibilities, and your rights."
      canonicalPath="/en/legal/terms"
      current="terms"
      tagLine="Legal Policies"
      backLabel="Back to Home"
      backHref="/?lang=en"
      navItems={[
        { key: "terms", label: "Terms of Service", href: "/en/legal/terms" },
        { key: "privacy", label: "Privacy Policy", href: "/en/legal/privacy" },
      ]}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{termsContent}</ReactMarkdown>
    </LegalLayout>
  );
}
