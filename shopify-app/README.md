# ToldYou Button – Shopify App Embed (P1.S MVP)

This directory contains the minimal assets required to ship a Shopify App Embed Block that injects the hosted ToldYou Button widget using a Config ID generated in the main ToldYou web app.

## Structure

```
shopify-app/
└── extensions/
    └── toldyou-button/
        └── blocks/
            └── toldyou-button.liquid
```

## Block behaviour

- Reads `config_id` from the App Embed Block setting.
- When the field is not empty, renders `<script src="https://chatbutton.backtrue.com/widget.js?v=1.0.0" data-config-id="{{ config_id }}"></script>`.
- When empty, nothing is rendered, keeping the storefront clean.

## Getting started

1. Scaffold a Shopify app (e.g. `shopify app init toldyou-button`).
2. Copy the `extensions/toldyou-button/` folder into your project (or merge with an existing extension).
3. Update the constants inside `blocks/toldyou-button.liquid` if your widget base URL or version differs.
4. Register and deploy the extension:
   - `shopify app deploy`
   - `shopify app release`
5. In the Shopify admin → Online Store → Themes → Customize → App embeds，啟用 **ToldYou Button**。
6. 貼上從 ToldYou 成功頁或 Email 取得的 Config ID，儲存即可在前台渲染按鈕。

## QA checklist

- [ ] 啟用 App Embed、貼上有效 ID → 前台載入 ToldYou widget。
- [ ] 將欄位清空或停用 App Embed → script 不再輸出。
- [ ] 更新 Config ID → 刷新後載入新設定。

## 後續任務

- 補充行銷素材與上架描述（使用 Web App 截圖）。
- 撰寫使用教學文件／影片。
- 評估是否需要環境變數管理 widget 基底網址與版本號。
