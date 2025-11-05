import { useLocation } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Copy, FileCode, ArrowLeft } from 'lucide-react';
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

  // Get data from URL params or state
  const urlParams = new URLSearchParams(window.location.search);
  const email = urlParams.get('email') || '';
  const code = sessionStorage.getItem('widgetCode') || '';

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

  if (!code) {
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

        {/* Code Block */}
        <Card className="p-6 mb-6">
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

        {/* Installation Instructions */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">快速安裝指南</h3>
          
          <div className="space-y-6">
            {/* WordPress */}
            <div className="border-l-4 border-primary pl-4">
              <h4 className="font-semibold text-foreground mb-2">WordPress 網站</h4>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>登入 WordPress 管理後台</li>
                <li>前往「外觀」→「自訂」→「額外的 CSS/JS」</li>
                <li>貼上程式碼到「頁尾程式碼」區域</li>
                <li>點擊「發布」儲存</li>
              </ol>
            </div>

            {/* Shopify */}
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold text-foreground mb-2">Shopify 商店</h4>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>登入 Shopify 管理後台</li>
                <li>前往「網路商店」→「佈景主題」→「編輯程式碼」</li>
                <li>找到 theme.liquid 檔案</li>
                <li>在 <code className="bg-gray-100 px-1 rounded">&lt;/body&gt;</code> 標籤前貼上程式碼</li>
                <li>點擊「儲存」</li>
              </ol>
            </div>

            {/* HTML */}
            <div className="border-l-4 border-orange-500 pl-4">
              <h4 className="font-semibold text-foreground mb-2">純 HTML 網站</h4>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>開啟您的 HTML 檔案（通常是 index.html）</li>
                <li>在 <code className="bg-gray-100 px-1 rounded">&lt;/body&gt;</code> 標籤前貼上程式碼</li>
                <li>儲存檔案並上傳至伺服器</li>
              </ol>
            </div>
          </div>
        </Card>

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
        </footer>
      </main>
    </div>
  );
}
