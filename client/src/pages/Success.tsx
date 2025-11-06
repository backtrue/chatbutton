import { Link, useLocation } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Copy, FileCode, ArrowLeft, Clipboard } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface SuccessPageProps {
  code: string;
  email: string;
}

export default function Success() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [activeTab, setActiveTab] = useState<'plugin' | 'manual'>('manual');

  // Retrieve data from sessionStorage to avoid exposing email in URL
  const email = sessionStorage.getItem('userEmail') || '';
  const code = sessionStorage.getItem('widgetCode') || '';
  const configId = sessionStorage.getItem('widgetConfigId') || '';

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast({
        title: '✓ 已複製',
        description: '程式碼已複製到剪貼簿',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: '複製失敗',
        description: '請手動選擇並複製程式碼',
        variant: 'destructive',
      });
    }
  };

  const copyConfigId = async () => {
    if (!configId) {
      toast({
        title: '無可複製的 ID',
        description: '請重新產生按鈕或稍後再試。',
        variant: 'destructive',
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(configId);
      setCopiedId(true);
      toast({
        title: '✓ 已複製',
        description: 'Config ID 已複製到剪貼簿',
      });
      setTimeout(() => setCopiedId(false), 2000);
    } catch (error) {
      toast({
        title: '複製失敗',
        description: '請手動選擇並複製 Config ID',
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
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation('/')}
              className="gap-2"
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4" />
              返回
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">ToldYou Button</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Success Message */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            程式碼已準備就緒！
          </h2>
          <p className="text-muted-foreground">
            我們已經將安裝程式碼寄送到 <strong>{email}</strong>
          </p>
        </div>

        {/* Code Block & Config ID Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(value: string) => setActiveTab(value as 'plugin' | 'manual')}
          className="mb-6"
        >
          <TabsList className="grid w-full grid-cols-2 bg-muted">
            <TabsTrigger value="plugin">WordPress / Shopify</TabsTrigger>
            <TabsTrigger value="manual">手動安裝 (HTML)</TabsTrigger>
          </TabsList>

          <TabsContent value="plugin" className="mt-4 space-y-4">
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Clipboard className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">WordPress / Shopify 安裝</h3>
              </div>

              <p className="text-sm text-muted-foreground">
                請複製下方 <strong>Config ID</strong> 並貼到外掛或 App 的設定欄位中。
              </p>
              <div className="flex items-center gap-2">
                <Input
                  value={configId || ''}
                  readOnly
                  placeholder="尚未取得 Config ID，請返回上一頁重新生成"
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
                  <span className="sr-only">複製 Config ID</span>
                </Button>
              </div>

              {!configId && (
                <p className="text-xs text-destructive">
                  尚未偵測到 Config ID，請返回上一頁重新生成。
                </p>
              )}
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">快速安裝指南</h3>
              <div className="space-y-6">
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold text-foreground mb-2">WordPress 外掛</h4>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>登入 WordPress 後台 → 「外掛」 → 「ToldYou Button」。</li>
                    <li>貼上上方 Config ID 並點擊「儲存」。</li>
                    <li>回到網站前台重新整理頁面檢查按鈕。</li>
                  </ol>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-foreground mb-2">Shopify App</h4>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>登入 Shopify 後台 → 「Apps」 → 「ToldYou Button」。</li>
                    <li>貼上上方 Config ID 並儲存設定。</li>
                    <li>重新整理商店前台確認按鈕顯示。</li>
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
                  <h3 className="text-lg font-semibold text-foreground">您的程式碼</h3>
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
                      已複製
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      複製程式碼
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
              <h3 className="text-lg font-semibold text-foreground mb-4">快速安裝指南</h3>
              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-semibold text-foreground mb-2">純 HTML 網站</h4>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>開啟您的 HTML 檔案（通常是 index.html）。</li>
                  <li>
                    在 <code>&lt;/body&gt;</code> 標籤前貼上上方程式碼。
                  </li>
                  <li>儲存檔案並上傳至伺服器後重新整理頁面。</li>
                </ol>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Next Steps */}
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="text-lg font-semibold text-foreground mb-2">接下來</h3>
          <p className="text-sm text-muted-foreground mb-4">
            上傳程式碼後，重新整理您的網站即可看到聊天按鈕出現！
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => setLocation('/')}
              variant="default"
              data-testid="button-create-another"
            >
              建立另一個按鈕
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open('https://thinkwithblack.com', '_blank')}
              data-testid="link-thinkwithblack"
            >
              了解更多關於報數據
            </Button>
          </div>
        </Card>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            © 2024 ToldYou Button ·
            <a
              href="https://thinkwithblack.com"
              target="_blank"
              rel="noopener"
              className="ml-1 text-primary hover:underline"
              data-testid="link-footer-backlink"
            >
              報數據
            </a>
          </p>
          <nav className="mt-2 flex items-center justify-center gap-3">
            <Link
              href="/legal/terms"
              className="text-primary hover:underline"
              data-testid="link-success-footer-terms"
            >
              使用者條款
            </Link>
            <span aria-hidden="true">·</span>
            <Link
              href="/legal/privacy"
              className="text-primary hover:underline"
              data-testid="link-success-footer-privacy"
            >
              隱私權政策
            </Link>
          </nav>
        </footer>
      </main>
    </div>
  );
}
