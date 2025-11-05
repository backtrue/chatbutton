import type { ButtonConfig } from "@shared/schema";
import { getBacklinkText } from "../client/src/lib/i18n";
import { Resend } from 'resend';

export interface EmailService {
  sendCode(email: string, code: string, config: ButtonConfig, lang: string): Promise<void>;
}

// Resend Email Service using Replit Integration
export class ResendEmailService implements EmailService {
  private async getResendClient() {
    const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
    const xReplitToken = process.env.REPL_IDENTITY 
      ? 'repl ' + process.env.REPL_IDENTITY 
      : process.env.WEB_REPL_RENEWAL 
      ? 'depl ' + process.env.WEB_REPL_RENEWAL 
      : null;

    if (!xReplitToken) {
      throw new Error('X_REPLIT_TOKEN not found for repl/depl');
    }

    const connectionSettings = await fetch(
      'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
      {
        headers: {
          'Accept': 'application/json',
          'X_REPLIT_TOKEN': xReplitToken
        }
      }
    ).then(res => res.json()).then(data => data.items?.[0]);

    if (!connectionSettings || (!connectionSettings.settings.api_key)) {
      throw new Error('Resend not connected');
    }
    
    return {
      client: new Resend(connectionSettings.settings.api_key),
      fromEmail: connectionSettings.settings.from_email
    };
  }

  async sendCode(email: string, code: string, config: ButtonConfig, lang: string): Promise<void> {
    const subject = this.getSubject(lang);
    const html = this.generateEmailHTML(code, config, lang);

    const { client, fromEmail } = await this.getResendClient();

    const { error } = await client.emails.send({
      from: fromEmail,
      to: email,
      subject,
      html,
    });

    if (error) {
      throw new Error(`Failed to send email: ${error.message}`);
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
    .highlight { background: #fef3c7; padding: 2px 6px; border-radius: 3px; }
  </style>
</head>
<body>
  <h1>🎉 您的聊天按鈕程式碼已準備就緒！</h1>
  <p>感謝您使用 <strong>ToldYou Button</strong>！以下是您的專屬按鈕程式碼。</p>
  
  <p><span class="badge">✓ 完全免費</span> <span class="badge">✓ 無限使用</span> <span class="badge">✓ 超簡短程式碼</span></p>

  <h2>📋 您的程式碼（只有 3 行！）</h2>
  <div class="code-block">
    <code>${this.escapeHtml(code)}</code>
  </div>

  <p style="background: #dbeafe; padding: 12px; border-radius: 6px; font-size: 14px;">
    💡 <strong>新版本！</strong>我們已將程式碼簡化為 3 行，更方便安裝。所有設定都安全儲存在雲端。
  </p>

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
  <p>安裝後，您的網站右下角（或左下角）將出現一個可收合的聊天按鈕：</p>
  <ul>
    <li>點擊主按鈕可展開/收合平台選項</li>
    <li>每個平台按鈕使用官方品牌色（LINE 綠、Messenger 藍等）</li>
    <li>主按鈕使用您自訂的顏色</li>
    <li>自動響應式設計，在手機上也能完美顯示</li>
  </ul>

  <h2>🔧 常見問題</h2>
  <p><strong>Q: 按鈕沒有出現？</strong></p>
  <p>A: 請確認程式碼貼在 <code>&lt;/body&gt;</code> 標籤之前，並清除瀏覽器快取重新整理。</p>
  
  <p><strong>Q: 可以改變按鈕顏色或位置嗎？</strong></p>
  <p>A: 請回到 ToldYou Button 重新生成新的程式碼，選擇不同的顏色和位置即可。</p>

  <div class="footer">
    <p>需要更多協助？訪問 <a href="https://thinkwithblack.com" style="color: #2563eb; text-decoration: none;">報數據</a></p>
    <p style="margin-top: 10px; color: #9ca3af; font-size: 12px;">
      © 2024 ToldYou Button · 由 <a href="https://thinkwithblack.com" style="color: #9ca3af;">報數據</a> 提供
    </p>
  </div>
</body>
</html>
    `.trim();
  }

  private escapeHtml(unsafe: string): string {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}

// Mock Email Service for development
export class MockEmailService implements EmailService {
  async sendCode(email: string, code: string, config: ButtonConfig, lang: string): Promise<void> {
    console.log('📧 [Mock Email Service] Would send email to:', email);
    console.log('Subject:', this.getSubject(lang));
    console.log('Code length:', code.length, 'characters');
    console.log('---');
  }

  private getSubject(lang: string): string {
    const subjects: Record<string, string> = {
      'zh-TW': '您的 ToldYou 聊天按鈕程式碼已準備就緒',
      'ja': 'ToldYou チャットボタンのコードが準備完了しました',
      'en': 'Your ToldYou Chat Button Code is Ready',
    };
    return subjects[lang] || subjects['zh-TW'];
  }
}

// Factory function
export function createEmailService(): EmailService {
  // Always use Resend integration
  return new ResendEmailService();
}
