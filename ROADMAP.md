# ToldYou Button 開發路線圖 & 任務追蹤

**最後更新**：2025-11-05  
**目前階段**：P1 MVP 完成 → P2/P3 規劃中

---

## 📋 優先順序 1：部署流程 & 快取策略

### 背景
- 目前 widget.js 快取 1 小時，使用者更新設定後可能載入舊版本
- 需要版本管理或更激進的快取策略

### 任務拆解

#### 1.1 實作 Widget 版本控制
- **目標**：每次部署時自動更新版本號，embed code 包含版本參數
- **檔案**：`server/widget.ts`、`server/widget-loader.ts`
- **工作項**：
  - [x] 在 `generateSimplifiedEmbedCode` 加入版本參數（例如 `?v=1.0.0`）@server/widget.ts#1-105
  - [x] 版本號從環境變數（`WIDGET_VERSION`、`WIDGET_BUILD_ID`、`COMMIT_SHA`、`npm_package_version`）讀取，回退 `1.0.0`@server/version.ts#1-28
  - [ ] 測試：確認 embed code 包含版本號（於 /api/configs 回傳的 code 中檢查 `?v=`）
- **預期產出**：`<script src="...widget.js?v=1.0.0" data-config-id="...">`

#### 1.2 調整 widget.js 快取策略
- **目標**：根據版本號調整 Cache-Control，版本變更時強制重新載入
- **檔案**：`server/routes.ts` (GET /widget.js)
- **工作項**：
  - [x] 若版本號在 URL 中，設定 `Cache-Control: public, max-age=31536000, immutable`@server/routes.ts#94-108
  - [x] 若無版本號，保持 `max-age=3600` (1 小時)@server/routes.ts#94-108
  - [x] 文件化快取策略（補充營運測試手冊，見下方測試步驟）
- **預期產出**：使用者更新設定 → 新 embed code 帶新版本 → 瀏覽器強制重新載入

#### 1.3 測試快取行為
- **目標**：驗證版本更新時快取生效
- **工作項**：
  - [x] 手動測試：使用新舊版本號請求 `/widget.js`，確認快取策略差異
  - [x] 檢查 DevTools Network 標籤中的 Cache-Control 響應頭（含 `immutable`）
  - [x] 文件化測試步驟供營運參考（可附於 ROADMAP 或 docs）

##### 🛠 營運測試步驟
1. **確認最新嵌入程式碼是否含版本號**
   1. 登入 ToldYou Button 後台，於「產生程式碼」頁面建立或更新任一設定。
   2. 產出的 `<script>` 片段應為：`<script src="https://<你的網域>/widget.js?v=版本" data-config-id="..."></script>`。
   3. 若未看到 `?v=`，請通知工程團隊（代表部署流程異常）。
2. **驗證帶版本號的快取行為**
   1. 於瀏覽器開新分頁，訪問 `https://<你的網域>/widget.js?v=1.0.0`（以實際版本取代）。
   2. 開啟 DevTools → Network → 選取 `widget.js` → 查看 Response Headers。
   3. 確認 `Cache-Control` 為 `public, max-age=31536000, immutable`。
   4. 重新整理頁面（可勾選 DevTools「Disable cache」以觀察重新下載），Status 應為 200 (from disk cache 或 memory cache 亦可)。
3. **驗證無版本號的快取行為**
   1. 訪問 `https://<你的網域>/widget.js`（移除 `?v=`）。
   2. 檢查 Response Headers，`Cache-Control` 應為 `public, max-age=3600`。
   3. 記錄兩者差異，以確認版本參數生效。
4. **模擬版本更新**
   1. 將嵌入程式碼中的版本號手動改成另一個值（例如 `?v=1.0.1`），再次載入該 URL。
   2. DevTools 應顯示重新下載 `widget.js`，並套用一年快取策略。
5. **問題排查建議**
   - 若 Response Headers 未符合預期，請截圖並回報工程團隊，附上實際請求 URL。
   - 確保測試分頁未啟用任何會改寫快取的瀏覽器外掛。

#### 1.4 Config ID 體驗優化 ✅
- **目標**：讓使用者在成功頁、Email 及外掛流程中，更容易取得與複製 `config ID`
- **參考文件**：`attached_assets/configid.md`
- **完成事項**：
  - Home.tsx：在 `submitMutation.onSuccess` 中同步寫入 `sessionStorage.setItem('widgetConfigId', response.id)`，確保成功頁可立即存取。
  - Success.tsx：
    - 讀取 `widgetConfigId` 並提供 `copyConfigId` 按鈕，採水平輸入框＋等高複製鍵設計。
    - Tab 介面改為 `手動安裝 (HTML)` 為預設頁籤，`WordPress / Shopify` 為第二頁籤。
    - Plugin 分頁顯示 Config ID 與 WordPress / Shopify 指南；HTML 分頁顯示三行程式碼與 `<body>` 內嵌教學。
  - Email：`sendCode` 以 Regex 擷取 `data-config-id`，`generateEmailHTML` 新增 Config ID 區塊（淡藍底）與 WordPress / Shopify 指引。
- **驗證紀錄（2025-11-06）**：
  - ✅ 成功頁 WordPress / Shopify 分頁可順利複製 Config ID，刷新後仍保留顯示。
  - ✅ 寄送通知 Email，Config ID 淡藍區塊與指引文字顯示正常（參考附件截圖）。
- **成果**：Config ID 在前端體驗與通知信件中皆可快速取得，支援 P1.W / P1.S 安裝流程。

---

## 📋 優先順序 2：P2 SaaS 升級架構

### 背景
- P1 為一次性產生程式碼的模式
- P2 需要使用者登入、編輯、版本管理、自動匯入 P1 設定

### 任務拆解

#### 2.1 設計認證系統 (Magic Link)
- **目標**：無密碼登入，使用 Magic Link 驗證 email
- **檔案**：新增 `server/auth.ts`、`server/routes.ts` (新增 auth 路由)
- **工作項**：
  - [ ] 設計 Magic Link 流程：
    - 使用者輸入 email → 後端生成 token（JWT 或隨機字串）
    - 寄送 email 含 link：`https://app.com/auth/verify?token=xxx`
    - 使用者點擊 → 驗證 token → 設定 session/cookie
  - [ ] 選擇 token 儲存方案：建議沿用 Replit 既有的 PostgreSQL（Neon）並建立 `magic_links` 臨時表（token、email、expiresAt、consumed），免額外維運 Redis
  - [ ] 決定 token 過期時間（建議 15 分鐘）
  - [ ] 實作 middleware 檢查登入狀態
- **預期產出**：
  - POST `/api/auth/send-magic-link` (email) → 寄送 link
  - GET `/auth/verify?token=xxx` → 驗證並設定 session
  - Middleware 保護需登入的路由

#### 2.2 建立會員系統 & 儀表板
- **目標**：使用者可登入、查看/編輯所有設定、管理多個按鈕
- **檔案**：新增 `shared/schema.ts` (users 表)、前端新增 Dashboard 頁面
- **工作項**：
  - [ ] 擴展 schema：
    - 新增 `users` 表 (id, email, createdAt, updatedAt)
    - 修改 `configs` 表加 `userId` FK
  - [ ] 後端 API：
    - [ ] GET `/api/user/configs` - 列出使用者所有設定
    - [ ] PUT `/api/configs/:id` - 編輯現有設定
    - [ ] DELETE `/api/configs/:id` - 刪除設定
    - [ ] POST `/api/configs/:id/regenerate-code` - 重新生成 embed code
  - [ ] 前端 Dashboard：
    - [ ] 登入後顯示設定列表
    - [ ] 編輯表單（複用 Home.tsx 邏輯）
    - [ ] 複製 embed code 按鈕
    - [ ] 刪除確認對話
- **預期產出**：使用者登入後可管理多個按鈕設定

#### 2.3 P1 設定自動匯入
- **目標**：P1 使用者（已有 email）可一鍵升級至 P2，保留舊設定
- **檔案**：`server/routes.ts`、前端新增升級流程
- **工作項**：
  - [ ] 設計升級 API：
    - POST `/api/auth/upgrade-from-p1?email=xxx` 
    - 檢查是否存在 P1 config
    - 若存在，自動建立 user 並關聯 config
  - [ ] 前端升級提示：
    - 登入時若偵測到 P1 email，提示「升級至 P2」
    - 一鍵確認升級
  - [ ] 測試：
    - [ ] 用 P1 email 登入 → 自動匯入舊設定
    - [ ] 驗證 config 仍可用
- **預期產出**：P1 使用者無縫升級至 P2

#### 2.4 新功能：歡迎訊息 (Greeting Message)
- **目標**：使用者可設定按鈕展開時的歡迎文案
- **檔案**：`shared/schema.ts` (ButtonConfig)、`server/widget-loader.ts`、前端 Home.tsx
- **工作項**：
  - [ ] 擴展 ButtonConfig：
    - 新增 `greetingMessage?: string` (選填)
  - [ ] 前端表單：
    - [ ] 新增「歡迎訊息」輸入框（可選）
    - [ ] 預覽效果
  - [ ] Widget 渲染：
    - [ ] 若設定了歡迎訊息，按鈕展開時顯示在頂部
    - [ ] 樣式：灰色背景、小字、自動換行
  - [ ] 測試：
    - [ ] 設定歡迎訊息 → embed code → 驗證 widget 顯示
- **預期產出**：widget 支援歡迎訊息展示

#### 2.5 動態 JS：app.js?id=USER
- **目標**：使用者每次編輯設定後，embed code 無需更新，widget 自動讀取最新設定
- **檔案**：`server/routes.ts` (新增 GET /app.js)、`server/widget-loader.ts`
- **工作項**：
  - [ ] 新增路由 GET `/app.js?id=USER_ID`
    - 動態讀取該 user 的最新 config
    - 返回完整 widget JS（包含 config 內聯）
  - [ ] 修改 embed code 生成邏輯：
    - 選項 A（簡單）：改用 `<script src="...app.js?id=xxx">`
    - 選項 B（進階）：保持 data-config-id，但 widget.js 每次都重新抓 API
  - [ ] 快取策略：
    - [ ] app.js 不快取或短快取（max-age=60）
    - [ ] 使用者編輯 → 立即生效
  - [ ] 測試：
    - [ ] 編輯設定 → 不更新 embed code → 驗證 widget 自動更新
- **預期產出**：使用者編輯設定無需重新部署 embed code

#### 2.6 P1.W / P1.S 外掛整合
- **目標**：提供 WordPress 外掛與 Shopify App 作為「ID 貼上器」，支援 GTM 推廣並維持低維運成本
- **參考文件**：`attached_assets/P1W-P1S.md`
- **架構原則**：P1 Web App (Home.tsx) 為唯一設定中心，外掛/App 只負責貼入 data-config-id 並載入 widget
- **共用準備**：
  - [ ] 在成功頁與 FAQ 文件化取得 data-config-id 的步驟（Email / success 頁面）
  - [ ] 提供統一腳本範例 `<script src="https://button.toldyou.co/widget.js?v={VERSION}" data-config-id="{ID}"></script>`
  - [x] 記錄正式環境 widget base URL：`https://button.toldyou.co`
  - [ ] 準備行銷素材：Web App UI 截圖（PlatformCard、ColorPicker 等）供商店上架使用
- **P1.W (WordPress Plugin) MVP**
  - [ ] 專案結構：建立 `wp-plugin/` 目錄或獨立 repo
  - [ ] 後台 UI：於「設定」新增子選單「ToldYou Button」，頁面只有一個文字輸入（config ID）與儲存按鈕
  - [ ] 提示文案：明確指引用戶前往 P1 網站生成資料，貼上成功頁的 data-config-id（例：a1b2c3d4-...）
  - [ ] 後端邏輯：
    - [ ] 註冊設定欄位 `toldyou_button_config_id`
    - [ ] 使用 `admin_menu` / `admin_init` 建立設定頁與儲存流程
    - [ ] `add_action('wp_footer', ...)` 讀取 `get_option`，若存在 ID 則輸出 widget script（含版本 query 與 data-config-id）
  - [ ] 測試：
    - [ ] 貼上有效 ID → 前台載入 ToldYou Button
    - [ ] 清空 ID → 不輸出 script，避免空白載入
- **P1.S (Shopify App) MVP**
  - [ ] 專案結構：建立 `shopify-app/` 目錄（可使用 Shopify CLI scaffold）
  - [ ] 使用 App Embed Block（無需獨立後台頁面）
  - [ ] schema 設定：
    - [ ] 單一 `type: "text"` 設定 `id: "config_id"`，label 為「ToldYou Button Config ID」
    - [ ] `info` 提示文案與 WP 相同
  - [ ] Liquid 邏輯：
    - [ ] `{%- assign config_id = block.settings.config_id -%}`
    - [ ] 若存在 → 輸出 `<script src="...widget.js?v=..." data-config-id="{{ config_id }}"></script>`
  - [ ] 測試：
    - [ ] 主題編輯器啟用 App Embed → 輸入 ID → 頁面載入按鈕
    - [ ] 未輸入 ID → 不載入 script
- **上架與行銷**：
  - [ ] 撰寫商店描述：清楚列出三步驟（安裝 → 產生 ID → 貼上儲存）
  - [ ] 準備審核資料（圖示、支援信箱、隱私條款連結）
  - [ ] 規劃版本號、更新流程與 Changelog
- **預期產出**：
  - WordPress 外掛與 Shopify App 皆可透過貼上 ID 輕鬆載入 ToldYou Button
  - 完整上架素材與操作說明，支援中文教學渠道推廣

#### 2.7 Config ID 體驗優化
- **目標**：讓使用者在成功頁、Email 及未來外掛流程中，更容易取得與複製 `config ID`
- **參考文件**：`attached_assets/configid.md`
- **Home.tsx 儲存流程**：
  - [ ] 在 `submitMutation.onSuccess` 中，與 `widgetCode`、`userEmail` 一同寫入 `sessionStorage.setItem('widgetConfigId', response.id)`
- **Success.tsx 體驗**：
  - [ ] 自 `sessionStorage` 讀取 `widgetConfigId`
  - [ ] 加入 `copiedId` 狀態與 `copyConfigId` 函式，提供單獨複製 ID 的按鈕
  - [ ] 以 Tabs 重構成功頁：
    - [ ] `TabsList`：`WordPress / Shopify`（預設）與 `手動安裝 (HTML)` 兩個分頁
    - [ ] `TabsContent value="plugin"`：顯示 Config ID、複製按鈕、外掛引導文字
    - [ ] `TabsContent value="manual"`：沿用既有完整程式碼卡片與複製功能
- **Email 通知更新**：
  - [ ] 在 `sendCode` 中以 Regex 解析 `configId`（`data-config-id="..."`）並傳入 `generateEmailHTML`
  - [ ] 調整 `generateEmailHTML` 函式簽名加入 `configId`
  - [ ] 新增樣式與區塊：
    - [ ] CSS `id-block` 樣式（淡藍底、等寬字體顯示 ID）
    - [ ] 於 Email 內容加入「🚀 WordPress / Shopify 用戶」段落，列出 Config ID
- **測試**：
  - [ ] 送出表單 → 成功頁 WordPress/Shopify 分頁可正確複製 ID
  - [ ] 刷新成功頁（sessionStorage 仍在）→ 保留 ID 顯示
  - [ ] 寄送 Email → 驗證新區塊與 ID 顯示正確
- **預期產出**：config ID 在前後台體驗統一，支援 P1.W / P1.S 安裝流程

---

## 📋 優先順序 3：P3 多語擴充

### 背景
- 目前 schema 有 `lang` 欄位，Email 有多語 subject
- 需要前台語系切換、widget 多語支援、backlink 文案本地化

### 任務拆解

#### 3.1 前台語系選擇 UI
- **目標**：使用者可切換網站語系（初期支援 zh-TW / ja / en）
- **檔案**：`client/src/pages/Home.tsx`、`client/src/lib/i18n.ts`
- **工作項**：
  - [ ] 建立語系 state/context 與預設語言判斷
  - [ ] 支援透過 URL 參數 `?lang=` 決定語言（未提供時 fallback 至預設）
  - [ ] 語系切換 UI（導覽列或頁面頂部）
  - [ ] 語言設定與 localStorage 同步（記住使用者選擇）
  - [ ] 自動依語言載入對應翻譯文案
  - [ ] 表單標籤、placeholder、提示文字根據語系切換
  - [ ] 測試：
    - [ ] 切換語系 → 表單文字更新
    - [ ] 重新整理 → 保留選擇的語系
- **預期產出**：使用者可選擇 zh-TW / ja / en

#### 3.2 多語 Email 內容
- **目標**：Email 主旨、內文、安裝教學根據 `lang` 欄位本地化
- **檔案**：`server/email.ts`
- **工作項**：
  - [ ] 擴展 `generateEmailHTML`：
    - [ ] 日文版本：主旨、標題、安裝步驟（WordPress/Shopify/HTML）
    - [ ] 英文版本：同上
  - [ ] 驗證 HTML 編碼正確（UTF-8）
  - [ ] 測試：
    - [ ] 提交表單時選擇日/英 → 驗證寄出的 Email 語言正確
- **預期產出**：Email 根據使用者選擇的語言寄送

#### 3.3 Widget 多語 Backlink 文案
- **目標**：widget 底部的「報數據」backlink 根據語系顯示不同文案
- **檔案**：`server/widget-loader.ts`、`client/src/lib/i18n.ts`
- **工作項**：
  - [ ] 擴展 `getBacklinkText` 支援 ja/en
  - [ ] 修改 widget-loader 生成邏輯：
    - [ ] 從 config API 讀取 `lang` 欄位
    - [ ] 根據 lang 選擇 backlink 文案
  - [ ] 測試：
    - [ ] 建立 ja config → embed code → 驗證 widget backlink 為日文
    - [ ] 建立 en config → 驗證 widget backlink 為英文
- **預期產出**：widget backlink 自動本地化

#### 3.4 Widget UI 多語支援
- **目標**：widget 按鈕標籤、aria-label 等根據語系顯示
- **檔案**：`server/widget-loader.ts`
- **工作項**：
  - [ ] 定義多語按鈕標籤對照表（zh/ja/en）
  - [ ] 修改 widget 生成邏輯：
    - [ ] 根據 config lang 選擇標籤語言
    - [ ] 例如：LINE → 「LINE」(zh) / 「LINE」(ja) / 「LINE」(en)
  - [ ] 測試：
    - [ ] 各語系 config → 驗證 widget 按鈕標籤正確
- **預期產出**：widget 按鈕標籤本地化

#### 3.5 國際化流程文件
- **目標**：記錄如何新增語言、翻譯清單、測試步驟
- **檔案**：新增 `docs/i18n-guide.md`
- **工作項**：
  - [ ] 列出所有需翻譯的文案位置
  - [ ] 建立翻譯清單模板
  - [ ] 文件化測試步驟
- **預期產出**：營運人員可按指南新增語言

---

## 📋 優先順序 4：營運支援 & 監控

### 背景
- 需要基本的錯誤追蹤、使用量統計、營運工具

### 任務拆解

#### 4.1 Email 寄信失敗紀錄
- **目標**：追蹤寄信失敗原因，便於除錯
- **檔案**：`server/email.ts`、`shared/schema.ts` (新增 email_logs 表)
- **工作項**：
  - [ ] 新增 `email_logs` 表：
    - id, email, subject, status (success/failed), error_message, createdAt
  - [ ] 修改 `sendCode` 邏輯：
    - [ ] 成功時記錄 status='success'
    - [ ] 失敗時記錄 status='failed' 與 error_message
  - [ ] 後端 API：
    - [ ] GET `/api/admin/email-logs` (需認證) - 查看寄信紀錄
  - [ ] 測試：
    - [ ] 模擬寄信失敗 → 驗證紀錄
- **預期產出**：營運可查看寄信狀態

#### 4.2 基本分析：Config 建立數
- **目標**：追蹤有多少使用者建立了設定
- **檔案**：`server/routes.ts`、新增分析 API
- **工作項**：
  - [ ] 後端 API：
    - [ ] GET `/api/admin/stats` (需認證) - 返回：
      - 總 config 數
      - 今日新增
      - 各平台使用率
      - 各語系分布
  - [ ] 前端儀表板（可選）：
    - [ ] 簡單圖表顯示統計數據
  - [ ] 測試：
    - [ ] 建立多個 config → 驗證統計數字正確
- **預期產出**：營運可查看基本使用統計

#### 4.3 錯誤日誌 & 監控
- **目標**：記錄 API 錯誤、異常，便於除錯
- **檔案**：`server/routes.ts`、新增 logging middleware
- **工作項**：
  - [ ] 新增簡單 logger（可用 console 或 pino）
  - [ ] 記錄：
    - [ ] 所有 API 請求的方法、路徑、狀態碼、耗時
    - [ ] 錯誤堆疊追蹤
  - [ ] 可選：整合第三方服務（Sentry、Datadog）
  - [ ] 文件化日誌查看方式
- 確保測試分頁未啟用任何會改寫快取的瀏覽器外掛。

---

## 📋 優先順序 5：法務文件（Terms & Privacy）

### 背景
- 目前網站缺少 Terms of Service 與 Privacy Policy；需建立英文原文並提供繁中/日文版本
- 中文版頁腳需立即顯示「使用者條款」與「隱私權政策」連結，指向繁中內容
- 英文與日文版連結及頁面可預先完成並暫存，待國際化上線時啟用

### 任務拆解

#### 5.1 撰寫英文版 Terms of Service & Privacy Policy（參考 getbutton.io）
- **目標**：產出符合 ToldYou Button 服務範圍的英文 Terms / Privacy 內容
- **檔案建議**：`legal/en/terms-of-service.md`、`legal/en/privacy-policy.md`
- **工作項**：
  - [ ] 依 ToldYou Button 功能與責任調整條款範本（參考 getbutton.io 章節架構）
  - [ ] 明確定義退款、使用限制、責任免除、資料蒐集範圍
  - [ ] 內含最新更新日期、聯絡資訊（支援 email）
- **預期產出**：兩份英文 markdown 文件供翻譯與未來上線使用

#### 5.2 翻譯與在地化（繁中 / 日文）
- **目標**：產出繁體中文、日文版 Terms / Privacy，確保語意與法律用語準確
- **檔案建議**：
  - 繁中：`legal/zh-TW/terms-of-service.md`、`legal/zh-TW/privacy-policy.md`
  - 日文：`legal/ja/terms-of-service.md`、`legal/ja/privacy-policy.md`
- **工作項**：
  - [ ] 進行專業翻譯並校稿（可委外或內部審核）
  - [ ] 確認中文法律術語（例如「使用者條款」、「隱私權政策」、「個人資料保護」）
  - [ ] 日文版本維持敬語、清楚告知資料利用目的
- **預期產出**：三語完整文件集，可供各語系前端讀取

#### 5.3 建立前端頁面與路由
- **目標**：在現有網站中加入靜態法務頁面
- **檔案建議**：
  - React：`client/src/pages/legal/terms.zh-TW.tsx`、`client/src/pages/legal/privacy.zh-TW.tsx`
  - 後續預留 en / ja 對應頁面（可先建立並隱藏導航）
- **工作項**：
  - [ ] 建立共用 LegalLayout（含標題、導覽、回首頁按鈕）
  - [ ] 讀取對應 markdown 內容或直接在頁面渲染
  - [ ] SEO：設定 `<title>`、`<meta description>`、Canonical URL
- **預期產出**：繁中 Terms / Privacy 頁面可直接公開，英日頁面預設不曝光

#### 5.4 更新繁中頁腳與 UI 連結
- **目標**：在現有繁中 UI（含 widget 頁或主站 footer）加入法務連結
- **檔案**：`client/src/pages/Home.tsx`（或共用 Layout）
- **工作項**：
  - [ ] 新增「使用者條款」、「隱私權政策」連結，指向繁中頁面
  - [ ] 版面調整與 RWD 驗證
  - [ ] 預留英文/日文語系切換後自動切換連結（可先在程式邏輯標記 TODO）
- **預期產出**：繁中頁腳顯示法務連結，英文/日文待未來啟用

#### 5.5 法務審查與發佈流程
- **目標**：確保文件內容經法務/營運覆核並可追蹤版本
- **工作項**：
  - [ ] 建立版本控管（Git history + 文件記錄更新日期）
  - [ ] 安排審閱流程（營運初審 → 法務覆核 → 負責人簽核）
  - [ ] 發佈後公告（Blog / 站內通知，如需）
- **預期產出**：合規可追溯的 Terms / Privacy 文件與對應流程

### 測試 / 驗證
- [ ] 確認繁中頁面可從首頁 footer 進入並通過 Lighthouse 無障礙檢查
- [ ] 驗證英/日頁面網址存在但未曝光（可透過直接 URL 驗證）
- [ ] 檢查 sitemap / robots 設定是否需要加入（或暫時排除）

---

## 📊 任務優先級 & 時間估算

| 優先級 | 項目 | 預估工時 | 依賴 | 狀態 |
| --- | --- | --- | --- | --- |
| 1 | 部署流程 & 快取策略 | 4-6h | 無 | ⏳ 待開始 |
| 2.1 | Magic Link 認證 | 6-8h | 無 | ⏳ 待開始 |
| 2.2 | 會員系統 & 儀表板 | 8-12h | 2.1 | ⏳ 待開始 |
| 2.3 | P1 自動匯入 | 4-6h | 2.1, 2.2 | ⏳ 待開始 |
| 2.4 | 歡迎訊息功能 | 4-6h | 2.2 | ⏳ 待開始 |
| 2.5 | 動態 JS (app.js?id=) | 4-6h | 2.2 | ⏳ 待開始 |
| 3.1 | 前台語系選擇 | 2-3h | 無 | ⏳ 待開始 |
| 3.2 | 多語 Email | 2-3h | 3.1 | ⏳ 待開始 |
| 3.3 | Widget Backlink 本地化 | 2-3h | 3.1 | ⏳ 待開始 |
| 3.4 | Widget UI 多語 | 2-3h | 3.1 | ⏳ 待開始 |
| 3.5 | i18n 流程文件 | 1-2h | 3.1-3.4 | ⏳ 待開始 |
| 4.1 | Email 寄信紀錄 | 3-4h | 無 | ⏳ 待開始 |
| 4.2 | 基本分析 | 3-4h | 無 | ⏳ 待開始 |
| 4.3 | 錯誤日誌 & 監控 | 2-3h | 無 | ⏳ 待開始 |
| 5.1 | Terms/Privacy 英文撰寫 | 4-6h | 無 | ⏳ 待開始 |
| 5.2 | Terms/Privacy 翻譯 (zh/ja) | 6-8h | 5.1 | ⏳ 待開始 |
| 5.3 | 法務頁面建置 | 4-6h | 5.2 | ⏳ 待開始 |
| 5.4 | 頁腳 & 導覽更新 | 2-3h | 5.3 | ⏳ 待開始 |
| 5.5 | 法務審查與發佈流程 | 2-3h | 5.1-5.4 | ⏳ 待開始 |

**總計**：約 52-80 小時（依實際複雜度調整）

---

## 🎯 建議執行順序

### 第一階段（1-2 週）
1. ✅ **優先級 1**：部署流程 & 快取策略（快速勝利，改善使用體驗）
2. ✅ **優先級 2.1**：Magic Link 認證（P2 基礎）
3. ✅ **優先級 4.1**：Email 寄信紀錄（營運支援）

### 第二階段（2-3 週）
4. ✅ **優先級 2.2**：會員系統 & 儀表板（核心功能）
5. ✅ **優先級 2.3**：P1 自動匯入（用戶遷移）
6. ✅ **優先級 3.1-3.2**：前台語系 & 多語 Email

### 第三階段（3-4 週）
7. ✅ **優先級 2.4**：歡迎訊息功能（新功能）
8. ✅ **優先級 2.5**：動態 JS（無縫更新）
9. ✅ **優先級 3.3-3.5**：Widget 多語 & 文件

### 第四階段（1 週）
10. ✅ **優先級 4.2-4.3**：分析 & 監控

---

## 📝 進度追蹤

### 當前狀態
- **P1 完成度**：100% ✅
- **P2 完成度**：0% ⏳
- **P3 完成度**：0% ⏳
- **營運支援完成度**：0% ⏳

### 最近更新
- 2025-11-05：初版路線圖建立，所有任務拆解完成

### 下一步
- [ ] 確認優先級與時間表
- [ ] 分配開發資源
- [ ] 開始第一階段任務

---

## 📚 參考資料

- PRD：`attached_assets/ToldYou Button PRD-clone from getbutton_1762328205401.md`
- 程式碼結構：見 `/server` 與 `/client` 目錄
- 已完成功能：見本文件頂部「目前成果亮點」
