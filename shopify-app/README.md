# ToldYou Button – Shopify App (P1.S MVP)

This directory contains a complete Shopify app project that ships an App Embed Block, injecting the hosted ToldYou Button widget onto storefronts using a Config ID generated in the main ToldYou web app.

## Structure

```
shopify-app/
├── shopify.app.toml              # App configuration
├── package.json                  # Dependencies and scripts
├── .gitignore
├── SETUP.md                      # Setup and deployment guide
├── README.md                     # This file
└── extensions/
    └── toldyou-button/
        ├── shopify.extension.toml # Extension configuration
        └── blocks/
            └── toldyou-button.liquid  # App Embed Block
```

## Block behaviour

- Reads `config_id` from the App Embed Block setting.
- When the field is not empty, renders `<script src="https://button.toldyou.co/widget.js?v=1.0.0" data-config-id="{{ config_id }}"></script>`.
- When empty, nothing is rendered, keeping the storefront clean.

## Getting started

See [SETUP.md](./SETUP.md) for detailed setup and deployment instructions.

Quick start:

```bash
cd shopify-app
npm install
shopify app dev
```

Then in Shopify Admin → Online Store → Themes → Customize → App embeds，啟用 **ToldYou Button**，貼上 Config ID 即可。

## QA checklist

- [ ] 啟用 App Embed、貼上有效 ID → 前台載入 ToldYou widget。
- [ ] 將欄位清空或停用 App Embed → script 不再輸出。
- [ ] 更新 Config ID → 刷新後載入新設定。

## 後續任務

- 補充行銷素材與上架描述（使用 Web App 截圖）。
- 撰寫使用教學文件／影片。
- 評估是否需要環境變數管理 widget 基底網址與版本號。
