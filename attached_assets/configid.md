### **第 1 步：在 `Home.tsx` 頁面儲存 Config ID**

**目標：** 當使用者成功提交表單時，除了儲存完整程式碼，也要單獨儲存 `config ID`。

**檔案：** `client/src/pages/Home.tsx`

**如何做：** 在 `submitMutation` 的 `onSuccess` 處理函式中，找到您儲存 `widgetCode` 和 `userEmail` 的地方，在下面新增一行：

TypeScript  
// ...  
    onSuccess: (response: any, variables: FormData) \=\> {  
      // Store code in sessionStorage for success page  
      sessionStorage.setItem('widgetCode', response.code);  
      // \[SECURITY FIX\] Store email in sessionStorage instead of URL param  
      sessionStorage.setItem('userEmail', variables.email);  
        
      // \[P1.W/P1.S UPDATE\] Store the config ID separately for easy copy  
      sessionStorage.setItem('widgetConfigId', response.id); // \<--- ★ 請新增這一行  
        
      // Navigate to success page using wouter (avoids page reload)  
      // \[SECURITY FIX\] Remove email from URL  
      setLocation(\`/success\`); // \<--- ★ 確保這裡沒有 email 參數  
    },  
// ...

---

### **第 2 步：在 `Success.tsx` 頁面顯示「複製 ID」選項**

**目標：** 重構成功頁面，使用「頁籤 (Tabs)」來區分「WP/Shopify 用戶」和「手動安裝用戶」。

**檔案：** `client/src/pages/Success.tsx`

**如何做：**

**讀取資料：** 從 `sessionStorage` 讀取我們剛剛存入的 `configId`。  
TypeScript  
// ...  
// \[P1.W/P1.S UPDATE\] Read the config ID  
const configId \= sessionStorage.getItem('widgetConfigId') || '';  
// ...

1.   
2. **新增狀態與複製功能：**  
   * 新增一個 `copiedId` 狀態：`const [copiedId, setCopiedId] = useState(false);`  
   * 建立一個新的 `copyConfigId` 函式，專門用來複製 `configId`。  
3. **重構 UI (使用 Tabs)：**  
   * 從 `@/components/ui/tabs` 匯入 `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger`。  
   * 找到原本顯示「您的程式碼」的 `<Card>`。  
   * 將該區塊替換為一個 `<Tabs>` 元件，包含兩個頁籤：  
     * **頁籤 1 (預設)：** "WordPress / Shopify"。其內容 (`<TabsContent value="plugin">`) 是一個新的 `<Card>`，只顯示 `configId` 和 `copyConfigId` 按鈕。  
     * **頁籤 2：** "手動安裝 (HTML)"。其內容 (`<TabsContent value="manual">`) 則是**原本的** `<Card>`，顯示完整的 `code` 和 `copyCode` 按鈕。

---

### **第 3 步：在「通知 Email」中也加入 Config ID**

**目標：** 讓使用者在 Email 中也能直接複製 ID，而不用複製整段程式碼。

**檔案：** `server/email.ts`

**如何做：**

1. **在 `sendCode` 中解開 ID：**  
   * `sendCode` 函式收到的 `code` 是完整的 `<script>` 字串。您需要用正規表示法 (Regex) 把 `configId` 從字串中「解」出來。

TypeScript  
// ...  
async sendCode(email: string, code: string, config: ButtonConfig, lang: string): Promise\<void\> {  
  const subject \= this.getSubject(lang);

  // \[P1.W/P1.S UPDATE\] Extract configId from code snippet to pass to email  
  const configIdMatch \= code.match(/data-config-id="(\[^"\]+)"/); // \<--- ★ 新增  
  const configId \= configIdMatch ? configIdMatch\[1\] : '';   // \<--- ★ 新增

  const html \= this.generateEmailHTML(code, config, lang, configId); // \<--- ★ 傳入 configId  
// ...

2.   
3. **在 `generateEmailHTML` 中加入 ID 區塊：**  
   * 修改函式簽名以接收 `configId: string`。  
   * 在 `</style>` 標籤內，加入 `id-block` 的 CSS 樣式。  
   * 在 `<body>` 內，`</p>` (徽章) 之後，加入新的「WordPress / Shopify 用戶」區塊，並在其中顯示 `configId`。

HTML  
\<\!-- ... (CSS 樣式) ... \--\>  
    /\* \[P1.W/P1.S UPDATE\] Styles for Config ID block \*/  
    .id-block { background: \#dbeafe; border: 1px solid \#bfdbfe; border-radius: 6px; padding: 15px; margin: 20px 0; }  
    .id-block code { font-family: 'Courier New', Consolas, monospace; font-size: 14px; color: \#1e3a8a; display: block; white-space: nowrap; overflow-x: auto; padding-bottom: 5px; }  
  \</style\>  
\</head\>  
\<body\>  
  \<\!-- ... (標題和徽章) ... \--\>  
  \<p\>\<span class="badge"\>✓ 完全免費\</span\> \<span class="badge"\>✓ 無限使用\</span\> \<span class="badge"\>✓ 超簡短程式碼\</span\>\</p\>

  \<\!-- \[P1.W/P1.S UPDATE\] New Block for WP/Shopify users \--\>  
  \<h2\>🚀 WordPress / Shopify 用戶 (建議)\</h2\>  
  \<p style="font-size: 15px;"\>如果您是使用我們的 WordPress 或 Shopify 外掛，請複製下方的 \<strong\>Config ID\</strong\> 並貼到外掛設定中即可。\</p\>  
  \<div class="id-block"\>  
    \<p style="margin:0 0 10px 0; font-size: 14px; color: \#333;"\>您的 Config ID:\</p\>  
    \<code\>${configId}\</code\>  
  \</div\>

  \<h2\>💡 手動安裝 (HTML / GTM)\</h2\>  
  \<p style="font-size: 15px;"\>如果您需要手動安裝，請複製下方的\*\*完整程式碼\*\*...\</p\>  
  \<div class="code-block"\>  
    \<code\>${this.escapeHtml(code)}\</code\>  
  \</div\>  
  \<\!-- ... (後續內容) ... \--\>

4. 

---

完成這三步驟後，您的 P1.W 和 P1.S 推廣流程就會變得非常順暢。

