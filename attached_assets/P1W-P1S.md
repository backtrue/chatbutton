# **PRD 附錄：P1.W (WordPress) & P1.S (Shopify) 策略**

**文件目的：** 本附錄為 PRD v1.1 的補充，定義 P1 (MVP) 階段為配合 GTM (Go-to-Market) 推廣策略，所平行開發的 WordPress 外掛與 Shopify App。

## **1\. WHY (核心目的)**

* **1.1 策略 Why (GTM)：** P1 的核心推廣渠道（中文教學部落客）習慣於撰寫「WordPress 外掛」和「Shopify App」的評測與教學。我們必須提供此產品型態，才能與 GetButton 在**相同的推廣賽道**上競爭並被其推薦。  
* **1.2 使用者 Why (UX)：** 對於 WordPress/Shopify 新手（我們的 Persona 1），「安裝 App/Plugin」的體驗遠比「手動編輯 theme.liquid 或 header.php 檔案」更簡單、更安全。

## **2\. HOW (核心架構：ID 橋接模式)**

我們 P1 的核心架構是「**ID 橋接模式 (ID Bridge Mode)**」。

* **P1 Web App (ToldYou-Button 產生器)：** 這是**唯一的「設定中心」**。所有使用者（包含 WP/Shopify 用戶）**永遠**是來這裡（Home.tsx）設定按鈕、取得 data-config-id。  
* **P1.W (WordPress 外掛)：** 是一個**極輕量的「ID 貼上器」**。  
* **P1.S (Shopify App)：** 是一個**極輕量的「ID 貼上器」**。

此策略讓我們能以**最低的開發成本**（只需維護 P1 Web App 一個設定介面），同時**最大化我們的市場渠道**（Web, WP, Shopify）。

## **3\. WHAT (P1.W / P1.S 規格)**

### **3.1 P1.W (WordPress Plugin) MVP**

* **類型：** WordPress 外掛。  
* **後台介面 (UI)：**  
  * 在 WordPress 後台「設定」選單下新增一個子選單：「ToldYou Button」。  
  * 此頁面**只有一個** input\[type=text\] 欄位（用於貼上 ID）和一個「儲存」按鈕。  
* **關鍵文案 (UX)：**  
  * 在輸入框下方，必須有中文提示：「請前往 \[您的 P1 網站 URL\] 產生您的免費按鈕。完成後，將您 Email 或成功頁面上的 data-config-id (例如 a1b2c3d4-...) 貼在此處並儲存。」  
* **後端邏輯 (PHP)：**  
  1. 註冊 toldyou\_button\_config\_id 設定欄位。  
  2. 使用 add\_action('wp\_footer', ...) 鉤點。  
  3. get\_option('toldyou\_button\_config\_id') 取得 ID。  
  4. 如果 ID 存在，則 echo P1 的動態載入腳本：  
     \<script src="\[您的 P1 Widget.js 網址\]?v=\[版本號\]" data-config-id="\[使用者儲存的 ID\]"\>\</script\>

### **3.2 P1.S (Shopify App) MVP**

* **類型：** Shopify App，使用「**App Embed Block**」。  
* **後台介面 (UI)：**  
  * **無需**獨立後台頁面。  
  * 所有設定均在「佈景主題自訂」-\>「App 嵌入」中完成。  
* **App Embed Block 設定 (schema)：**  
  * schema 中**只有一個**設定：{"type": "text", "id": "config\_id", "label": "ToldYou Button Config ID"}  
* **關鍵文案 (UX)：**  
  * 在 schema 中加入 info 屬性（提示文字）：「請前往 \[您的 P1 網站 URL\] 產生您的免費按鈕。完成後，將您的 data-config-id (例如 a1b2c3d4-...) 貼在此處並儲存。」  
* **前端邏輯 (.liquid 檔案)：**  
  1. 讀取使用者填入的 ID：{%- assign config\_id \= block.settings.config\_id \-%}  
  2. 如果 ID 存在，則 render P1 的動態載入腳本：  
     \<script src="\[您的 P1 Widget.js 網址\]?v=\[版本號\]" data-config-id="{{ config\_id }}"\>\</script\>

## **4\. GTM (上架行銷策略)**

* **策略：** 「功能在 Web、商店在 App」。  
* **商店截圖：** **不**使用 P1.W / P1.S 空白設定頁的截圖。**必須**使用 P1 Web App (Home.tsx) 功能豐富的 UI 截圖（如 PlatformCard, ColorPicker）作為主要行銷素材。  
* **安裝教學 (Description)：** 文案需清楚引導使用者完成三步驟：  
  1. 安裝此外掛/App。  
  2. 前往 \[您的 P1 網站 URL\] **產生**您的免費按鈕並取得 data-config-id。  
  3. 回到 WordPress / Shopify 的外掛設定中，**貼上**此 ID 並儲存。