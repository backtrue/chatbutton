# ToldYou Button – Shopify App Setup Guide

## Prerequisites

- Node.js 18+ 已安裝
- Shopify CLI 已安裝（`npm install -g @shopify/cli`）
- 有效的 Shopify Partner 帳號

## 快速開始

### 1. 安裝依賴

```bash
cd shopify-app
npm install
```

### 2. 連結到 Shopify Partner 帳號

```bash
shopify app dev
```

首次執行時會要求登入 Shopify Partner 帳號，並選擇或建立一個測試應用。

### 3. 開發模式

開發伺服器會自動啟動，你可以在 Shopify Admin 中即時看到 App Embed Block 的變更。

### 4. 部署到測試商店

```bash
shopify app deploy
```

### 5. 發佈版本

```bash
shopify app release
```

## 檔案結構

```
shopify-app/
├── shopify.app.toml              # 應用程式設定
├── package.json                  # 依賴與腳本
├── .gitignore
├── SETUP.md                      # 本檔案
├── README.md                     # 功能說明
└── extensions/
    └── toldyou-button/
        ├── shopify.extension.toml # 擴展設定
        └── blocks/
            └── toldyou-button.liquid  # App Embed Block
```

## 測試流程

1. 在開發模式中（`shopify app dev`），進入 Shopify Admin 測試商店。
2. 進入 **Online Store → Themes → Customize**。
3. 在 **App embeds** 區域找到 **ToldYou Button**。
4. 啟用並貼上 Config ID（從 ToldYou Button 成功頁或 Email 取得）。
5. 儲存並檢查前台是否正確載入聊天按鈕。

## 常見問題

**Q: 如何更新 widget base URL？**  
A: 編輯 `extensions/toldyou-button/blocks/toldyou-button.liquid` 中的 `widget_base_url` 變數。

**Q: 如何更新版本號？**  
A: 編輯 `extensions/toldyou-button/blocks/toldyou-button.liquid` 中的 `widget_version` 變數。

**Q: 部署後多久會在 App Store 上架？**  
A: 需要提交審核，通常 1–7 個工作日。提交前請確保有完整的描述、截圖與隱私政策。

## 後續步驟

- 補充行銷素材（使用 Web App 截圖）
- 撰寫完整的應用程式描述與安裝指南
- 上傳隱私政策與服務條款
- 提交到 Shopify App Store 審核
