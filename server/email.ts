import type { ButtonConfig } from "@shared/schema";
import { getBacklinkText } from "../client/src/lib/i18n";

export interface EmailService {
  sendCode(email: string, code: string, config: ButtonConfig, lang: string): Promise<void>;
}

// Resend Email Service
export class ResendEmailService implements EmailService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async sendCode(email: string, code: string, config: ButtonConfig, lang: string): Promise<void> {
    const subject = this.getSubject(lang);
    const html = this.generateEmailHTML(code, config, lang);

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'ToldYou Button <onboarding@resend.dev>',
        to: email,
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to send email: ${error}`);
    }
  }

  private getSubject(lang: string): string {
    const subjects: Record<string, string> = {
      'zh-TW': '您的 ToldYou 聊天按鈕程式碼已準備就緒',
      'ja': 'ToldYou チャットボタンのコードが準備完了しました',
      'en': 'Your ToldYou Chat Button Code is Ready',
    };
    return subjects[lang] || subjects['zh-TW'];
  }

  private generateEmailHTML(code: string, config: ButtonConfig, lang: string): string {
    // Generate email HTML with installation instructions
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Noto Sans TC', -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    h1 { color: #2563eb; font-size: 24px; margin-bottom: 10px; }
    h2 { color: #1e40af; font-size: 18px; margin-top: 30px; margin-bottom: 15px; }
    .code-block { background: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 6px; padding: 15px; margin: 20px 0; overflow-x: auto; }
    .code-block code { font-family: 'Courier New', Consolas, monospace; font-size: 13px; color: #1f2937; display: block; white-space: pre-wrap; word-break: break-all; }
    .instructions { background: #f9fafb; border-left: 4px solid #2563eb; padding: 15px; margin: 15px 0; }
    .instructions ol { margin: 10px 0; padding-left: 20px; }
    .instructions li { margin: 8px 0; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6b7280; text-align: center; }
    .badge { display: inline-block; background: #dcfce7; color: #166534; padding: 4px 12px; border-radius: 4px; font-size: 14px; font-weight: 600; }
  </style>
</head>
<body>
  <h1>🎉 您的聊天按鈕程式碼已準備就緒！</h1>
  <p>感謝您使用 <strong>ToldYou Button</strong>！以下是您的專屬按鈕程式碼。</p>
  
  <p><span class="badge">✓ 完全免費</span> <span class="badge">✓ 無限使用</span></p>

  <h2>📋 您的程式碼</h2>
  <div class="code-block">
    <code>${this.escapeHtml(code)}</code>
  </div>

  <h2>💡 安裝說明</h2>
  
  <div class="instructions">
    <h3>WordPress 網站</h3>
    <ol>
      <li>登入您的 WordPress 管理後台</li>
      <li>前往「外觀」→「自訂」→「額外的 CSS/JS」（或使用插件如 Insert Headers and Footers）</li>
      <li>將上方程式碼貼到「頁尾程式碼」區域</li>
      <li>點擊「發布」儲存變更</li>
    </ol>
  </div>

  <div class="instructions">
    <h3>Shopify 商店</h3>
    <ol>
      <li>登入您的 Shopify 管理後台</li>
      <li>前往「網路商店」→「佈景主題」→「編輯程式碼」</li>
      <li>找到 <code>theme.liquid</code> 檔案</li>
      <li>在 <code>&lt;/body&gt;</code> 標籤<strong>之前</strong>貼上程式碼</li>
      <li>點擊「儲存」</li>
    </ol>
  </div>

  <div class="instructions">
    <h3>純 HTML 網站</h3>
    <ol>
      <li>開啟您的 HTML 檔案（通常是 index.html）</li>
      <li>在 <code>&lt;/body&gt;</code> 標籤<strong>之前</strong>貼上程式碼</li>
      <li>儲存檔案並上傳至您的伺服器</li>
    </ol>
  </div>

  <h2>✨ 預覽效果</h2>
  <p>上傳後，重新整理您的網站，您將在<strong>${config.position === 'bottom-right' ? '右下角' : '左下角'}</strong>看到聊天按鈕！</p>

  <div class="footer">
    <p>如有任何問題，歡迎聯絡我們的客服團隊。</p>
    <p>© 2024 ToldYou Button · Powered by <a href="https://thinkwithblack.com" target="_blank" style="color: #2563eb; text-decoration: none;">報數據</a></p>
  </div>
</body>
</html>
    `.trim();
  }

  private escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }
}

// Mock Email Service for development/testing
export class MockEmailService implements EmailService {
  async sendCode(email: string, code: string, config: ButtonConfig, lang: string): Promise<void> {
    console.log('='.repeat(80));
    console.log('📧 MOCK EMAIL SENT');
    console.log('='.repeat(80));
    console.log(`To: ${email}`);
    console.log(`Subject: 您的 ToldYou 聊天按鈕程式碼已準備就緒`);
    console.log('\n--- CODE ---');
    console.log(code);
    console.log('='.repeat(80));
  }
}

// Factory function to create email service
export function createEmailService(): EmailService {
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    console.warn('⚠️  RESEND_API_KEY not found. Using MockEmailService.');
    return new MockEmailService();
  }
  
  return new ResendEmailService(apiKey);
}
