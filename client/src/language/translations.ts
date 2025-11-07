import type { Language } from "@shared/language";

export const PLATFORM_IDS = [
  "line",
  "messenger",
  "whatsapp",
  "instagram",
  "phone",
  "email",
] as const;

export type PlatformId = (typeof PLATFORM_IDS)[number];

export type HomeCopy = {
  metaTitle: string;
  metaDescription: string;
  heroTitle: string;
  tagline: string;
  freeBadgeLabel: string;
  languageSelectorLabel: string;
  platformSectionTitle: string;
  platformSectionSubtitle: string;
  platforms: Record<PlatformId, {
    name: string;
    description: string;
    placeholder: string;
    inputLabel: string;
  }>;
  buttonPositionLabel: string;
  positions: {
    left: string;
    right: string;
  };
  colorLabel: string;
  previewLabel: string;
  previewEmptyHint: string;
  previewToggleTitle: string;
  previewBacklinkLabel: string;
  emailLabel: string;
  emailPlaceholder: string;
  emailHelperText: string;
  submitLabel: string;
  submitPendingLabel: string;
  validation: {
    email: string;
    platform: string;
  };
  toast: {
    errorTitle: string;
    errorDescription: string;
  };
  footer: {
    termsLabel: string;
    privacyLabel: string;
    termsHref: string;
    privacyHref: string;
  };
};

export type SuccessCopy = {
  header: {
    backButton: string;
    productName: string;
  };
  hero: {
    title: string;
    description: {
      beforeEmail: string;
      afterEmail: string;
    };
  };
  tabs: {
    plugin: {
      label: string;
      card: {
        title: string;
        intro: {
          before: string;
          highlight: string;
          after: string;
        };
        placeholder: string;
        copyButtonSrLabel: string;
        missingWarning: string;
      };
      guideCard: {
        title: string;
        wordpress: {
          title: string;
          items: string[];
        };
        shopify: {
          title: string;
          items: string[];
        };
      };
    };
    manual: {
      label: string;
      codeCard: {
        title: string;
        copyButton: {
          default: string;
          copied: string;
        };
      };
      guideCard: {
        title: string;
        sectionTitle: string;
        items: string[];
      };
    };
  };
  toast: {
    copySuccessTitle: string;
    copyCodeSuccessDescription: string;
    copyConfigSuccessDescription: string;
    copyErrorTitle: string;
    copyCodeErrorDescription: string;
    copyConfigErrorDescription: string;
    missingConfigTitle: string;
    missingConfigDescription: string;
  };
  actions: {
    nextStepsTitle: string;
    nextStepsDescription: string;
    createAnother: string;
    learnMore: string;
  };
  footer: HomeCopy['footer'];
};

const HOME_COPY: Record<Language, HomeCopy> = {
  "zh-TW": {
    metaTitle: "提升轉換率的客服聊天入口 | ToldYou Button",
    metaDescription:
      "想提高轉換率、降低流失？ToldYou Button 幫你在網站上打造「想聊就聊」的客服入口。安裝只要 1 行程式碼，即可快速串連 LINE、Messenger、WhatsApp 等渠道，不再錯過潛在客戶。",
    heroTitle: "ToldYou Button",
    tagline: "一分鐘完成多平台客服按鈕設定",
    freeBadgeLabel: "完全免費",
    languageSelectorLabel: "選擇語言",
    platformSectionTitle: "選擇您要使用的平台",
    platformSectionSubtitle: "至少選擇一個平台，可以同時選擇多個",
    platforms: {
      line: {
        name: "LINE",
        description: "LINE 官方帳號 ID",
        placeholder: "例如：@yourlineid",
        inputLabel: "LINE ID",
      },
      messenger: {
        name: "Messenger",
        description: "Facebook 粉絲專頁名稱",
        placeholder: "例如：yourpagename",
        inputLabel: "FB 粉專名稱",
      },
      whatsapp: {
        name: "WhatsApp",
        description: "含國碼的手機號碼",
        placeholder: "例如：886912345678",
        inputLabel: "WhatsApp 號碼",
      },
      instagram: {
        name: "Instagram",
        description: "Instagram 帳號名稱",
        placeholder: "例如：yourusername",
        inputLabel: "IG 帳號",
      },
      phone: {
        name: "電話",
        description: "客服電話號碼",
        placeholder: "例如：0212345678",
        inputLabel: "電話號碼",
      },
      email: {
        name: "Email",
        description: "客服信箱地址",
        placeholder: "例如：support@example.com",
        inputLabel: "Email 地址",
      },
    },
    buttonPositionLabel: "按鈕位置",
    positions: {
      left: "左下角",
      right: "右下角",
    },
    colorLabel: "按鈕顏色",
    previewLabel: "預覽效果",
    previewEmptyHint: "請選擇至少一個平台來查看預覽",
    previewToggleTitle: "點擊切換展開/收合",
    previewBacklinkLabel: "報數據",
    emailLabel: "接收程式碼的 Email",
    emailPlaceholder: "your@email.com",
    emailHelperText: "我們絕不會發送垃圾郵件",
    submitLabel: "發送程式碼到我的信箱",
    submitPendingLabel: "發送中...",
    validation: {
      email: "請輸入有效的 Email 地址",
      platform: "請至少選擇一個平台",
    },
    toast: {
      errorTitle: "發送失敗",
      errorDescription: "請稍後再試，或聯絡我們的客服團隊。",
    },
    footer: {
      termsLabel: "使用者條款",
      privacyLabel: "隱私權政策",
      termsHref: "/legal/terms",
      privacyHref: "/legal/privacy",
    },
  },
  en: {
    metaTitle: "Get Your Button Free (Blazing Fast & No Sign-Up) | ToldYouButton",
    metaDescription:
      "ToldYouButton is the simply powerful free chat button. Blazing fast, no sign-up, and 1-minute setup. Connect with customers via WhatsApp & Instagram instantly. Why pay for slow, complex tools? Get your free widget now.",
    heroTitle: "ToldYou Button",
    tagline: "Set up your multi-channel support button in under a minute",
    freeBadgeLabel: "100% Free",
    languageSelectorLabel: "Choose language",
    platformSectionTitle: "Choose the platforms you want to enable",
    platformSectionSubtitle: "Select at least one platform—you can enable multiple at once",
    platforms: {
      line: {
        name: "LINE",
        description: "LINE Official Account ID",
        placeholder: "e.g. @yourlineid",
        inputLabel: "LINE ID",
      },
      messenger: {
        name: "Messenger",
        description: "Facebook Page name",
        placeholder: "e.g. yourpagename",
        inputLabel: "Facebook Page",
      },
      whatsapp: {
        name: "WhatsApp",
        description: "Phone number with country code",
        placeholder: "e.g. 886912345678",
        inputLabel: "WhatsApp Number",
      },
      instagram: {
        name: "Instagram",
        description: "Instagram username",
        placeholder: "e.g. yourusername",
        inputLabel: "Instagram Account",
      },
      phone: {
        name: "Phone",
        description: "Support phone number",
        placeholder: "e.g. 0212345678",
        inputLabel: "Phone Number",
      },
      email: {
        name: "Email",
        description: "Support email address",
        placeholder: "e.g. support@example.com",
        inputLabel: "Email Address",
      },
    },
    buttonPositionLabel: "Button position",
    positions: {
      left: "Bottom left",
      right: "Bottom right",
    },
    colorLabel: "Button color",
    previewLabel: "Preview",
    previewEmptyHint: "Select at least one platform to see the preview",
    previewToggleTitle: "Click to expand or collapse",
    previewBacklinkLabel: "Report Data",
    emailLabel: "Email to receive the code",
    emailPlaceholder: "your@email.com",
    emailHelperText: "We never send spam",
    submitLabel: "Send the code to my inbox",
    submitPendingLabel: "Sending...",
    validation: {
      email: "Please enter a valid email address",
      platform: "Select at least one platform",
    },
    toast: {
      errorTitle: "Unable to send",
      errorDescription: "Please try again in a moment or contact our support team.",
    },
    footer: {
      termsLabel: "Terms of Service",
      privacyLabel: "Privacy Policy",
      termsHref: "/legal/terms",
      privacyHref: "/legal/privacy",
    },
  },
  ja: {
    metaTitle: "CVRを上げる、“スタッフにつながる”ボタン | ToldYouButton",
    metaDescription:
      "問い合わせ率を上げたい？離脱を減らしたい？\nToldYouボタンは、サイトに「話しかけたくなる接点」をつくる簡単導入ツール。\nわずか1行のコードで、コンバージョンを逃しません。",
    heroTitle: "ToldYou Button",
    tagline: "1 分以内に複数チャネルのサポートボタンを設定できます",
    freeBadgeLabel: "完全無料",
    languageSelectorLabel: "言語を選択",
    platformSectionTitle: "利用したいプラットフォームを選択",
    platformSectionSubtitle: "最低 1 つのプラットフォームを選択してください。複数同時に設定できます",
    platforms: {
      line: {
        name: "LINE",
        description: "LINE公式アカウントID",
        placeholder: "例：@yourlineid",
        inputLabel: "LINE ID",
      },
      messenger: {
        name: "Messenger",
        description: "Facebookページ名",
        placeholder: "例：yourpagename",
        inputLabel: "Facebookページ",
      },
      whatsapp: {
        name: "WhatsApp",
        description: "国番号付きの電話番号",
        placeholder: "例：886912345678",
        inputLabel: "WhatsApp番号",
      },
      instagram: {
        name: "Instagram",
        description: "Instagramユーザー名",
        placeholder: "例：yourusername",
        inputLabel: "Instagramアカウント",
      },
      phone: {
        name: "電話",
        description: "サポート電話番号",
        placeholder: "例：0212345678",
        inputLabel: "電話番号",
      },
      email: {
        name: "Email",
        description: "サポートメールアドレス",
        placeholder: "例：support@example.com",
        inputLabel: "メールアドレス",
      },
    },
    buttonPositionLabel: "ボタンの表示位置",
    positions: {
      left: "左下",
      right: "右下",
    },
    colorLabel: "ボタンカラー",
    previewLabel: "プレビュー",
    previewEmptyHint: "プレビューを見るには最低 1 つのプラットフォームを選択してください",
    previewToggleTitle: "クリックして展開/折りたたみ",
    previewBacklinkLabel: "レポートデータ",
    emailLabel: "コード送信用メールアドレス",
    emailPlaceholder: "your@email.com",
    emailHelperText: "スパムメールは一切送信しません",
    submitLabel: "コードをメールで受け取る",
    submitPendingLabel: "送信中...",
    validation: {
      email: "有効なメールアドレスを入力してください",
      platform: "少なくとも 1 つのプラットフォームを選択してください",
    },
    toast: {
      errorTitle: "送信できません",
      errorDescription: "少し待ってから再試行するか、サポートまでご連絡ください。",
    },
    footer: {
      termsLabel: "利用規約",
      privacyLabel: "プライバシーポリシー",
      termsHref: "/legal/terms",
      privacyHref: "/legal/privacy",
    },
  },
};

const SUCCESS_COPY: Record<Language, SuccessCopy> = {
  "zh-TW": {
    header: {
      backButton: "返回",
      productName: "ToldYou Button",
    },
    hero: {
      title: "程式碼已準備就緒！",
      description: {
        beforeEmail: "我們已經將安裝程式碼寄送到 ",
        afterEmail: "",
      },
    },
    tabs: {
      plugin: {
        label: "WordPress / Shopify",
        card: {
          title: "WordPress / Shopify 安裝",
          intro: {
            before: "請複製下方 ",
            highlight: "Config ID",
            after: " 並貼到外掛或 App 的設定欄位中。",
          },
          placeholder: "尚未取得 Config ID，請返回上一頁重新生成",
          copyButtonSrLabel: "複製 Config ID",
          missingWarning: "尚未偵測到 Config ID，請返回上一頁重新生成。",
        },
        guideCard: {
          title: "快速安裝指南",
          wordpress: {
            title: "WordPress 外掛",
            items: [
              "登入 WordPress 後台 → 「外掛」 → 「ToldYou Button」。",
              "貼上上方 Config ID 並點擊「儲存」。",
              "回到網站前台重新整理頁面檢查按鈕。",
            ],
          },
          shopify: {
            title: "Shopify App",
            items: [
              "登入 Shopify 後台 → 「Apps」 → 「ToldYou Button」。",
              "貼上上方 Config ID 並儲存設定。",
              "重新整理商店前台確認按鈕顯示。",
            ],
          },
        },
      },
      manual: {
        label: "手動安裝 (HTML)",
        codeCard: {
          title: "您的程式碼",
          copyButton: {
            default: "複製程式碼",
            copied: "已複製",
          },
        },
        guideCard: {
          title: "快速安裝指南",
          sectionTitle: "純 HTML 網站",
          items: [
            "開啟您的 HTML 檔案（通常是 index.html）。",
            "在 <code>&lt;/body&gt;</code> 標籤前貼上上方程式碼。",
            "儲存檔案並上傳至伺服器後重新整理頁面。",
          ],
        },
      },
    },
    toast: {
      copySuccessTitle: "✓ 已複製",
      copyCodeSuccessDescription: "程式碼已複製到剪貼簿",
      copyConfigSuccessDescription: "Config ID 已複製到剪貼簿",
      copyErrorTitle: "複製失敗",
      copyCodeErrorDescription: "請手動選擇並複製程式碼",
      copyConfigErrorDescription: "請手動選擇並複製 Config ID",
      missingConfigTitle: "無可複製的 ID",
      missingConfigDescription: "請重新產生按鈕或稍後再試。",
    },
    actions: {
      nextStepsTitle: "接下來",
      nextStepsDescription: "上傳程式碼後，重新整理您的網站即可看到聊天按鈕出現！",
      createAnother: "建立另一個按鈕",
      learnMore: "了解更多關於報數據",
    },
    footer: HOME_COPY["zh-TW"].footer,
  },
  en: {
    header: {
      backButton: "Back",
      productName: "ToldYou Button",
    },
    hero: {
      title: "Your code is ready!",
      description: {
        beforeEmail: "We've sent the installation code to ",
        afterEmail: "",
      },
    },
    tabs: {
      plugin: {
        label: "WordPress / Shopify",
        card: {
          title: "WordPress / Shopify installation",
          intro: {
            before: "Copy the ",
            highlight: "Config ID",
            after: " below and paste it into the plugin or app settings.",
          },
          placeholder: "Config ID not found. Go back and generate one.",
          copyButtonSrLabel: "Copy Config ID",
          missingWarning: "No Config ID detected. Go back and generate a new one.",
        },
        guideCard: {
          title: "Quick start guide",
          wordpress: {
            title: "WordPress plugin",
            items: [
              "Log into the WordPress dashboard → Plugins → ToldYou Button.",
              "Paste the Config ID above and click Save.",
              "Refresh your site to confirm the button appears.",
            ],
          },
          shopify: {
            title: "Shopify app",
            items: [
              "Log into the Shopify admin → Apps → ToldYou Button.",
              "Paste the Config ID above and save your settings.",
              "Reload your storefront to verify the button is visible.",
            ],
          },
        },
      },
      manual: {
        label: "Manual install (HTML)",
        codeCard: {
          title: "Your code",
          copyButton: {
            default: "Copy code",
            copied: "Copied",
          },
        },
        guideCard: {
          title: "Quick start guide",
          sectionTitle: "Plain HTML site",
          items: [
            "Open your HTML file (usually index.html).",
            "Paste the code above before the <code>&lt;/body&gt;</code> tag.",
            "Save the file, upload it to your server, and refresh the page.",
          ],
        },
      },
    },
    toast: {
      copySuccessTitle: "Copied!",
      copyCodeSuccessDescription: "Code copied to clipboard.",
      copyConfigSuccessDescription: "Config ID copied to clipboard.",
      copyErrorTitle: "Copy failed",
      copyCodeErrorDescription: "Please select and copy the code manually.",
      copyConfigErrorDescription: "Please select and copy the Config ID manually.",
      missingConfigTitle: "No Config ID available",
      missingConfigDescription: "Generate a button again or try later.",
    },
    actions: {
      nextStepsTitle: "What's next",
      nextStepsDescription: "Upload the code and refresh your site to see the chat button in action!",
      createAnother: "Create another button",
      learnMore: "Learn more about Report Data",
    },
    footer: HOME_COPY.en.footer,
  },
  ja: {
    header: {
      backButton: "戻る",
      productName: "ToldYou Button",
    },
    hero: {
      title: "コードの準備ができました！",
      description: {
        beforeEmail: "インストールコードを ",
        afterEmail: " に送信しました。",
      },
    },
    tabs: {
      plugin: {
        label: "WordPress / Shopify",
        card: {
          title: "WordPress / Shopify での設定",
          intro: {
            before: "以下の ",
            highlight: "Config ID",
            after: " をコピーして、プラグインまたはアプリの設定欄に貼り付けてください。",
          },
          placeholder: "Config ID を取得できませんでした。前のページに戻って再生成してください",
          copyButtonSrLabel: "Config ID をコピー",
          missingWarning: "Config ID が見つかりません。前のページで再生成してください。",
        },
        guideCard: {
          title: "クイックスタートガイド",
          wordpress: {
            title: "WordPress プラグイン",
            items: [
              "WordPress 管理画面にログイン → 「プラグイン」 → 「ToldYou Button」。",
              "上記の Config ID を貼り付けて「保存」をクリック。",
              "サイトのフロントをリロードしてボタンを確認。",
            ],
          },
          shopify: {
            title: "Shopify アプリ",
            items: [
              "Shopify 管理画面にログイン → 「Apps」 → 「ToldYou Button」。",
              "上記の Config ID を貼り付けて設定を保存。",
              "ストアフロントを再読み込みしてボタンを確認。",
            ],
          },
        },
      },
      manual: {
        label: "手動設置 (HTML)",
        codeCard: {
          title: "あなたのコード",
          copyButton: {
            default: "コードをコピー",
            copied: "コピー済み",
          },
        },
        guideCard: {
          title: "クイックスタートガイド",
          sectionTitle: "純粋な HTML サイト",
          items: [
            "HTML ファイル（通常は index.html）を開きます。",
            "<code>&lt;/body&gt;</code> タグの直前に上記のコードを貼り付けます。",
            "ファイルを保存しサーバーにアップロードしてページを再読み込みします。",
          ],
        },
      },
    },
    toast: {
      copySuccessTitle: "コピーしました",
      copyCodeSuccessDescription: "コードをクリップボードにコピーしました。",
      copyConfigSuccessDescription: "Config ID をクリップボードにコピーしました。",
      copyErrorTitle: "コピーできませんでした",
      copyCodeErrorDescription: "コードを手動で選択してコピーしてください。",
      copyConfigErrorDescription: "Config ID を手動で選択してコピーしてください。",
      missingConfigTitle: "コピーできる ID がありません",
      missingConfigDescription: "ボタンを再生成するか、時間を置いて再度お試しください。",
    },
    actions: {
      nextStepsTitle: "次のステップ",
      nextStepsDescription: "コードをアップロードしてサイトを更新すると、チャットボタンが表示されます！",
      createAnother: "別のボタンを作成する",
      learnMore: "報數據について詳しく見る",
    },
    footer: HOME_COPY.ja.footer,
  },
};

export function getHomeCopy(language: Language): HomeCopy {
  return HOME_COPY[language] ?? HOME_COPY.en;
}

export function getSuccessCopy(language: Language): SuccessCopy {
  return SUCCESS_COPY[language] ?? SUCCESS_COPY.en;
}
