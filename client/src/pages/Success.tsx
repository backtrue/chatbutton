import { Link, useLocation } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Check, Copy, FileCode, ArrowLeft, Clipboard } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/language/language-context';
import { getHomeCopy, getSuccessCopy } from '@/language/translations';
import { getLanguageOptions, type Language } from '@shared/language';

type SuccessTab = 'plugin' | 'manual';

export default function Success() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { language, setLanguage } = useLanguage();
  const copy = useMemo(() => getSuccessCopy(language), [language]);
  const homeCopy = useMemo(() => getHomeCopy(language), [language]);
  const languageOptions = useMemo(() => getLanguageOptions(), []);
  const [copied, setCopied] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [activeTab, setActiveTab] = useState<SuccessTab>('manual');

  // Retrieve data from sessionStorage to avoid exposing email in URL
  const email = sessionStorage.getItem('userEmail') || '';
  const code = sessionStorage.getItem('widgetCode') || '';
  const configId = sessionStorage.getItem('widgetConfigId') || '';

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast({
        title: copy.toast.copySuccessTitle,
        description: copy.toast.copyCodeSuccessDescription,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('[Success] Failed to copy widget code', error);
      toast({
        title: copy.toast.copyErrorTitle,
        description: copy.toast.copyCodeErrorDescription,
        variant: 'destructive',
      });
    }
  };

  const copyConfigId = async () => {
    if (!configId) {
      toast({
        title: copy.toast.missingConfigTitle,
        description: copy.toast.missingConfigDescription,
        variant: 'destructive',
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(configId);
      setCopiedId(true);
      toast({
        title: copy.toast.copySuccessTitle,
        description: copy.toast.copyConfigSuccessDescription,
      });
      setTimeout(() => setCopiedId(false), 2000);
    } catch (error) {
      console.error('[Success] Failed to copy config id', error);
      toast({
        title: copy.toast.copyErrorTitle,
        description: copy.toast.copyConfigErrorDescription,
        variant: 'destructive',
      });
    }
  };

  if (!code || !email) {
    setLocation('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation('/')}
                className="gap-2"
                data-testid="button-back"
              >
                <ArrowLeft className="w-4 h-4" />
                {copy.header.backButton}
              </Button>
              <h1 className="text-2xl font-bold text-foreground">{copy.header.productName}</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {homeCopy.languageSelectorLabel}
              </span>
              <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languageOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-2">{copy.hero.title}</h2>
          <p className="text-muted-foreground">
            {copy.hero.description.beforeEmail}
            <strong>{email}</strong>
            {copy.hero.description.afterEmail}
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(value: string) => setActiveTab(value as SuccessTab)}
          className="mb-6"
        >
          <TabsList className="grid w-full grid-cols-2 bg-muted">
            <TabsTrigger value="plugin">{copy.tabs.plugin.label}</TabsTrigger>
            <TabsTrigger value="manual">{copy.tabs.manual.label}</TabsTrigger>
          </TabsList>

          <TabsContent value="plugin" className="mt-4 space-y-4">
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Clipboard className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">
                  {copy.tabs.plugin.card.title}
                </h3>
              </div>

              <p className="text-sm text-muted-foreground">
                {copy.tabs.plugin.card.intro.before}
                <strong>{copy.tabs.plugin.card.intro.highlight}</strong>
                {copy.tabs.plugin.card.intro.after}
              </p>
              <div className="flex items-center gap-2">
                <Input
                  value={configId || ''}
                  readOnly
                  placeholder={copy.tabs.plugin.card.placeholder}
                  className="font-mono text-sm h-10"
                  disabled={!configId}
                />
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  onClick={copyConfigId}
                  className="h-10 w-10 shrink-0"
                  data-testid="button-copy-config-id"
                  disabled={!configId}
                >
                  {copiedId ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span className="sr-only">{copy.tabs.plugin.card.copyButtonSrLabel}</span>
                </Button>
              </div>

              {!configId && (
                <p className="text-xs text-destructive">{copy.tabs.plugin.card.missingWarning}</p>
              )}
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                {copy.tabs.plugin.guideCard.title}
              </h3>
              <div className="space-y-6">
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold text-foreground mb-2">
                    {copy.tabs.plugin.guideCard.wordpress.title}
                  </h4>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    {copy.tabs.plugin.guideCard.wordpress.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ol>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-foreground mb-2">
                    {copy.tabs.plugin.guideCard.shopify.title}
                  </h4>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    {copy.tabs.plugin.guideCard.shopify.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="manual" className="mt-4 space-y-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">
                    {copy.tabs.manual.codeCard.title}
                  </h3>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyCode}
                  className="gap-2"
                  data-testid="button-copy-code"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      {copy.tabs.manual.codeCard.copyButton.copied}
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      {copy.tabs.manual.codeCard.copyButton.default}
                    </>
                  )}
                </Button>
              </div>

              <div className="bg-gray-50 rounded-md p-4 border border-gray-200 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-800 whitespace-pre-wrap break-all">
                  <code data-testid="text-widget-code">{code}</code>
                </pre>
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                {copy.tabs.manual.guideCard.title}
              </h3>
              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-semibold text-foreground mb-2">
                  {copy.tabs.manual.guideCard.sectionTitle}
                </h4>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  {copy.tabs.manual.guideCard.items.map((item) => (
                    <li key={item} dangerouslySetInnerHTML={{ __html: item }} />
                  ))}
                </ol>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {copy.actions.nextStepsTitle}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {copy.actions.nextStepsDescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => setLocation('/')}
              variant="default"
              data-testid="button-create-another"
            >
              {copy.actions.createAnother}
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open('https://thinkwithblack.com', '_blank')}
              data-testid="link-thinkwithblack"
            >
              {copy.actions.learnMore}
            </Button>
          </div>
        </Card>

        <footer className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            © 2024 {copy.header.productName} ·
            <a
              href="https://thinkwithblack.com"
              target="_blank"
              rel="noopener"
              className="ml-1 text-primary hover:underline"
              data-testid="link-footer-backlink"
            >
              {homeCopy.previewBacklinkLabel}
            </a>
          </p>
          <nav className="mt-2 flex items-center justify-center gap-3">
            <Link
              href={copy.footer.termsHref}
              className="text-primary hover:underline"
              data-testid="link-success-footer-terms"
            >
              {copy.footer.termsLabel}
            </Link>
            <span aria-hidden="true">·</span>
            <Link
              href={copy.footer.privacyHref}
              className="text-primary hover:underline"
              data-testid="link-success-footer-privacy"
            >
              {copy.footer.privacyLabel}
            </Link>
          </nav>
        </footer>
      </main>
    </div>
  );
}
