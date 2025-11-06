=== ToldYouButton ===
Contributors: toldyouteam
Tags: chat widget, customer service, messaging
Requires at least: 6.0
Tested up to: 6.8
Requires PHP: 7.4
Stable tag: 0.1.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Lightweight chat button integration for WordPress. Paste your Config ID and we'll inject the hosted widget on every page.

== Description ==
ToldYouButton 是一個極輕量的聊天按鈕整合外掛。使用者只需要在 ToldYouButton 雲端產生器取得 Config ID，貼回 WordPress 後台後，我們會在每個前台頁面自動載入托管的 widget.js，立刻展示多平台聊天入口。

* ✅ 完全雲端設定：所有外觀與平台設定皆在 ToldYouButton 產生器完成。
* ✅ 安裝超快速：僅需貼上一個 Config ID。
* ✅ 無痛更新：Config ID 不變的情況下，只要在生成器調整設定，前台即時同步。

== 功能特色 ==
1. 單一欄位貼上 Config ID 即完成整合。
2. 若未填寫 Config ID，前台不載入任何額外資源，保持乾淨。
3. Script URL 自動附帶版本參數 `?v=...`，確保快取更新。
4. 友善的後台提示文字，導引使用者前往 ToldYouButton 產生器。

== 安裝方式 ==
1. 下載 `toldyou-button.zip`，於 WordPress 後台「外掛 → 安裝外掛 → 上傳外掛」上傳並啟用。
2. 進入「設定 → ToldYouButton」，貼上從 ToldYouButton 成功頁或 Email 取得的 Config ID，並儲存變更。
3. 返回網站前台重新整理，應可看到聊天按鈕顯示於頁面角落。

== 常見問題 ==
= 在哪裡取得 Config ID？ =
請登入 <https://button.toldyou.co/>，產生免費按鈕後，於成功頁或寄送的 Email 內即可找到 Config ID。

= 我已貼上 Config ID，但按鈕沒有出現 =
請確認 Config ID 無多餘空格，並重新整理頁面或清除快取。如果仍未顯示，可在 ToldYouButton 產生器重新生成 Config ID。

= 可以更換按鈕顏色或平台順序嗎？ =
可以。回到 ToldYouButton 產生器調整設定後重新生成，使用相同的 Config ID 即可立即更新。

== 截圖 ==
1. WordPress 後台設定頁：單一欄位貼上 Config ID。
2. 插件啟用後，前台載入 ToldYouButton 聊天按鈕的示意圖。

== 更新紀錄 ==
= 0.1.0 =
* 初始版本：提供 Config ID 貼上功能並在前台註入 widget.js。

== 升級注意事項 ==
升級後建議確認「設定 → ToldYouButton」中的 Config ID 仍正確無誤。若有新版 widget.js 域名或版本變更，請重新儲存設定以刷新快取。
