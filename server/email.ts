import type { ButtonConfig } from "@shared/schema";
import { Resend } from "resend";
import { getBacklinkText } from "@shared/language";
import type { Language } from "@shared/language";

export interface EmailService {
  sendCode(email: string, code: string, config: ButtonConfig, lang: string): Promise<void>;
}

const EMAIL_SUBJECTS: Record<Language, string> = {
  "zh-TW": "您的 ToldYou 聊天按鈕程式碼已準備就緒",
  ja: "ToldYou チャットボタンのコードが準備完了しました",
  en: "Your ToldYou Chat Button Code is Ready",
};

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
    const normalizedLang = this.normalizeLanguage(lang);
    const subject = this.getSubject(normalizedLang);
    const configIdMatch = code.match(/data-config-id="([^"]+)"/);
    const configId = configIdMatch ? configIdMatch[1] : '';
    const html = this.generateEmailHTML(code, config, normalizedLang, configId);

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

  private normalizeLanguage(lang: string): Language {
    if (lang === "ja" || lang === "en" || lang === "zh-TW") {
      return lang;
    }
    return "zh-TW";
  }

  private getSubject(lang: Language): string {
    return EMAIL_SUBJECTS[lang] ?? EMAIL_SUBJECTS["zh-TW"];
  }

  private generateEmailHTML(code: string, config: ButtonConfig, lang: Language, configId: string): string {
    const t = EMAIL_COPY[lang] ?? EMAIL_COPY["zh-TW"];
    const backlinkText = getBacklinkText(lang);

    const instructionSections = [
      {
        title: t.instructions.wordpress.title,
        steps: t.instructions.wordpress.items,
        accent: "#2563eb",
      },
      {
        title: t.instructions.shopify.title,
        steps: t.instructions.shopify.items,
        accent: "#22c55e",
      },
      {
        title: t.instructions.html.title,
        steps: t.instructions.html.items,
        accent: "#f97316",
      },
    ];

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Noto Sans TC', 'Noto Sans JP', 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    h1 { color: #2563eb; font-size: 24px; margin-bottom: 10px; }
    h2 { color: #1e40af; font-size: 18px; margin-top: 30px; margin-bottom: 15px; }
    h3 { font-size: 16px; margin: 0 0 10px 0; }
    p { font-size: 15px; }
    .code-block { background: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 6px; padding: 15px; margin: 20px 0; overflow-x: auto; }
    .code-block code { font-family: 'Courier New', Consolas, monospace; font-size: 13px; color: #1f2937; display: block; white-space: pre-wrap; word-break: break-all; }
    .id-block { background: #dbeafe; border: 1px solid #bfdbfe; border-radius: 6px; padding: 15px; margin: 20px 0; }
    .id-block code { font-family: 'Courier New', Consolas, monospace; font-size: 14px; color: #1e3a8a; display: block; white-space: nowrap; overflow-x: auto; padding-bottom: 5px; }
    .instructions { background: #f9fafb; padding: 15px; margin: 15px 0; border-radius: 6px; border-left: 4px solid transparent; }
    .instructions ol { margin: 10px 0; padding-left: 20px; }
    .instructions li { margin: 8px 0; font-size: 14px; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6b7280; text-align: center; }
    .badge { display: inline-block; background: #dcfce7; color: #166534; padding: 4px 12px; border-radius: 4px; font-size: 13px; font-weight: 600; margin-right: 8px; }
    .highlight { background: #fef3c7; padding: 2px 6px; border-radius: 3px; }
  </style>
</head>
<body>
  <h1>${t.hero.title}</h1>
  <p>${t.hero.description}</p>

  <p>
    <span class="badge">${t.badges.free}</span>
    <span class="badge">${t.badges.unlimited}</span>
    <span class="badge">${t.badges.simple}</span>
  </p>

  <h2>${t.configSection.title}</h2>
  <p style="font-size: 15px;">${t.configSection.description}</p>
  <div class="id-block">
    <p style="margin:0 0 10px 0; font-size: 14px; color: #1e3a8a;">${t.configSection.label}</p>
    <code>${this.escapeHtml(configId || t.configSection.empty)}</code>
  </div>

  <h2>${t.codeSection.title}</h2>
  <div class="code-block">
    <code>${this.escapeHtml(code)}</code>
  </div>

  <p style="background: #dbeafe; padding: 12px; border-radius: 6px; font-size: 14px;">${t.codeSection.hint}</p>

  <h2>${t.instructions.title}</h2>
  ${instructionSections
    .map(
      (section) => `
  <div class="instructions" style="border-left-color: ${section.accent};">
    <h3>${section.title}</h3>
    <ol>
      ${section.steps.map((step: string) => `<li>${step}</li>`).join("\n      ")}
    </ol>
  </div>`
    )
    .join("\n")}

  <h2>${t.preview.title}</h2>
  <p>${t.preview.description}</p>
  <ul>
    ${t.preview.items.map((item: string) => `<li>${item}</li>`).join("\n    ")}
  </ul>

  <h2>${t.faq.title}</h2>
  ${t.faq.items
    .map(
      (item: { question: string; answer: string }) => `
  <p><strong>${item.question}</strong></p>
  <p>${item.answer}</p>`
    )
    .join("\n")}

  <div class="footer">
    <p>${t.footer.supportPrefix} <a href="https://thinkwithblack.com" style="color: #2563eb; text-decoration: none;">${backlinkText}</a></p>
    <p style="margin-top: 10px; color: #9ca3af; font-size: 12px;">
      © 2024 ToldYou Button · ${t.footer.providedBy} <a href="https://thinkwithblack.com" style="color: #9ca3af;">${backlinkText}</a>
    </p>
  </div>
</body>
</html>`;
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

type InstructionCopy = {
  title: string;
  items: string[];
};

type EmailCopy = {
  hero: {
    title: string;
    description: string;
  };
  badges: {
    free: string;
    unlimited: string;
    simple: string;
  };
  configSection: {
    title: string;
    description: string;
    label: string;
    empty: string;
  };
  codeSection: {
    title: string;
    hint: string;
  };
  instructions: {
    title: string;
    wordpress: InstructionCopy;
    shopify: InstructionCopy;
    html: InstructionCopy;
  };
  preview: {
    title: string;
    description: string;
    items: string[];
  };
  faq: {
    title: string;
    items: Array<{ question: string; answer: string }>;
  };
  footer: {
    supportPrefix: string;
    providedBy: string;
  };
};

const EMAIL_COPY: Record<Language, EmailCopy> = {
  "zh-TW": {
    hero: {
      title: "🎉 您的聊天按鈕程式碼已準備就緒！",
      description: "感謝您使用 ToldYou Button！以下是您的專屬按鈕程式碼。",
    },
    badges: {
      free: "✓ 完全免費",
      unlimited: "✓ 無限使用",
      simple: "✓ 超簡短程式碼",
    },
    configSection: {
      title: "🚀 WordPress / Shopify 用戶（建議）",
      description: "若您使用 ToldYou Button 的 WordPress 外掛或 Shopify App，請複製下方 Config ID 並貼到外掛設定中。",
      label: "您的 Config ID：",
      empty: "尚未偵測到 Config ID",
    },
    codeSection: {
      title: "📋 您的程式碼（只有 3 行！）",
      hint: "💡 新版本！我們已將程式碼簡化為 3 行，更方便安裝。所有設定都安全儲存在雲端。",
    },
    instructions: {
      title: "💡 安裝說明",
      wordpress: {
        title: "WordPress 網站",
        items: [
          "登入您的 WordPress 管理後台",
          "前往「外觀」→「自訂」→「額外的 CSS/JS」（或使用類似功能的外掛）",
          "將上方程式碼貼到「頁尾程式碼」區域",
          "點擊「發布」儲存變更",
        ],
      },
      shopify: {
        title: "Shopify 商店",
        items: [
          "登入您的 Shopify 管理後台",
          "前往「網路商店」→「佈景主題」→「編輯程式碼」",
          "開啟 <code>layout/theme.liquid</code> 檔案",
          "將程式碼貼到 <code>&lt;/body&gt;</code> 標籤<strong>之前</strong>",
          "點擊「儲存」",
        ],
      },
      html: {
        title: "純 HTML 網站",
        items: [
          "開啟您的 HTML 檔案（通常是 <code>index.html</code>）",
          "將程式碼貼到 <code>&lt;/body&gt;</code> 標籤<strong>之前</strong>",
          "儲存檔案並上傳到伺服器",
        ],
      },
    },
    preview: {
      title: "✨ 預覽效果",
      description: "安裝完成後，您的網站將出現以下互動按鈕：",
      items: [
        "主按鈕可自訂顏色與位置",
        "支援 LINE、Messenger、WhatsApp 等多平台",
        "行動與桌面裝置皆可完美顯示",
      ],
    },
    faq: {
      title: "🔧 常見問題",
      items: [
        {
          question: "按鈕沒有出現怎麼辦？",
          answer: "請確認程式碼已貼在 <code>&lt;/body&gt;</code> 標籤之前，並清除瀏覽器快取重新整理。",
        },
        {
          question: "可以改變按鈕顏色或位置嗎？",
          answer: "可以！回到 ToldYou Button 重新設定並產生新的程式碼即可。",
        },
      ],
    },
    footer: {
      supportPrefix: "需要更多協助？歡迎造訪",
      providedBy: "由",
    },
  },
  "ja": {
    hero: {
      title: "🎉 チャットボタンのコードが準備できました！",
      description: "ToldYou Button をご利用いただきありがとうございます。以下があなた専用のコードです。",
    },
    badges: {
      free: "✓ 完全無料",
      unlimited: "✓ 無制限利用",
      simple: "✓ たった 3 行",
    },
    configSection: {
      title: "🚀 WordPress / Shopify ユーザー向け（推奨）",
      description: "WordPress プラグインまたは Shopify アプリをご利用の場合は、以下の Config ID をコピーして設定欄に貼り付けてください。",
      label: "あなたの Config ID：",
      empty: "Config ID が検出されませんでした",
    },
    codeSection: {
      title: "📋 あなたのコード（わずか 3 行）",
      hint: "💡 新バージョンではコードを 3 行に短縮し、さらに設置が簡単になりました。設定はすべてクラウドに安全に保存されます。",
    },
    instructions: {
      title: "💡 設置手順",
      wordpress: {
        title: "WordPress サイト",
        items: [
          "WordPress 管理画面にログインします",
          "「外観」→「カスタマイズ」→「追加 CSS/JS」（または同等のプラグイン）に移動",
          "上記のコードをフッター用コード欄に貼り付けます",
          "「公開」をクリックして保存します",
        ],
      },
      shopify: {
        title: "Shopify ストア",
        items: [
          "Shopify 管理画面にログインします",
          "「オンラインストア」→「テーマ」→「コードを編集」に進みます",
          "<code>layout/theme.liquid</code> など該当するレイアウトファイルを開きます",
          "<code>&lt;/body&gt;</code> タグ<strong>直前</strong>にコードを貼り付けます",
          "「保存」をクリックします",
        ],
      },
      html: {
        title: "純粋な HTML サイト",
        items: [
          "通常は <code>index.html</code> のファイルを開きます",
          "<code>&lt;/body&gt;</code> タグ<strong>直前</strong>にコードを貼り付けます",
          "ファイルを保存してサーバーにアップロードします",
        ],
      },
    },
    preview: {
      title: "✨ ボタンのプレビュー",
      description: "設置後に表示されるボタンのイメージです：",
      items: [
        "ブランドカラーに合わせてカスタマイズ可能",
        "LINE や Messenger など複数チャネルをサポート",
        "PC・モバイルの両方で最適表示",
      ],
    },
    faq: {
      title: "🔧 よくある質問",
      items: [
        {
          question: "ボタンが表示されません。どうすればいいですか？",
          answer: "コードが <code>&lt;/body&gt;</code> タグの直前に配置されているか確認し、ブラウザのキャッシュをクリアして再読み込みしてください。",
        },
        {
          question: "ボタンの色や位置は変更できますか？",
          answer: "はい。ToldYou Button で再設定し、新しいコードを作成して貼り替えてください。",
        },
      ],
    },
    footer: {
      supportPrefix: "サポートが必要な場合は、こちらをご覧ください：",
      providedBy: "提供：",
    },
  },
  en: {
    hero: {
      title: "🎉 Your chat button code is ready!",
      description: "Thanks for using ToldYou Button. Your personalized embed code is below.",
    },
    badges: {
      free: "✓ 100% Free",
      unlimited: "✓ Unlimited usage",
      simple: "✓ Just 3 lines",
    },
    configSection: {
      title: "🚀 WordPress / Shopify users (recommended)",
      description: "If you’re using the ToldYou Button WordPress plugin or Shopify app, copy the Config ID below and paste it into the plugin settings.",
      label: "Your Config ID:",
      empty: "Config ID not detected yet",
    },
    codeSection: {
      title: "📋 Your code (only 3 lines!)",
      hint: "💡 New version! We trimmed the embed to three lines so it’s easier to install. All settings stay safely in the cloud.",
    },
    instructions: {
      title: "💡 Installation guide",
      wordpress: {
        title: "WordPress sites",
        items: [
          "Log in to your WordPress admin dashboard",
          "Navigate to Appearance → Customize → Additional CSS/JS (or use a header/footer plugin)",
          "Paste the code above into the footer scripts area",
          "Click Publish to save your changes",
        ],
      },
      shopify: {
        title: "Shopify stores",
        items: [
          "Log in to your Shopify admin",
          "Go to Online Store → Themes → Edit code",
          "Open <code>layout/theme.liquid</code>",
          "Paste the code right before the <code>&lt;/body&gt;</code> tag",
          "Click Save",
        ],
      },
      html: {
        title: "Plain HTML sites",
        items: [
          "Open your main HTML file (usually <code>index.html</code>)",
          "Paste the code right before the <code>&lt;/body&gt;</code> tag",
          "Save the file, upload it to your server, and refresh your site",
        ],
      },
    },
    preview: {
      title: "✨ Preview",
      description: "Here’s what your button experience will look like once installed:",
      items: [
        "Customizable colors and position",
        "Supports LINE, Messenger, WhatsApp, email, and more",
        "Responsive layout that works on desktop and mobile",
      ],
    },
    faq: {
      title: "🔧 Frequently asked questions",
      items: [
        {
          question: "The button isn’t showing—what should I check?",
          answer: "Make sure the script is placed right before the <code>&lt;/body&gt;</code> tag, and clear your browser cache and refresh.",
        },
        {
          question: "Can I change the button color or position?",
          answer: "Yes, you can! Go back to ToldYou Button, reconfigure, and generate a new code to replace the old one.",
        },
      ],
    },
    footer: {
      supportPrefix: "Need help? Contact our support team at",
      providedBy: "Provided by",
    },
  },
};

// Mock Email Service for development
export class MockEmailService implements EmailService {
  async sendCode(email: string, code: string, config: ButtonConfig, lang: string): Promise<void> {
    const normalized = lang === "ja" || lang === "en" || lang === "zh-TW" ? lang : "zh-TW";
    console.log(" 📧 [MockEmailService] To:", email);
    console.log("Subject:", EMAIL_SUBJECTS[normalized]);
    console.log("Code length:", code.length, "characters");
    console.log("---");
  }
}

// Factory function
export function createEmailService(): EmailService {
  // Always use Resend integration
  return new ResendEmailService();
}
