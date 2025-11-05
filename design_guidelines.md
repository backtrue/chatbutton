# ToldYou-Button Design Guidelines

## Design Approach
**System-Based: Material Design** - Selected for its clear form patterns, excellent Chinese typography support, and proven utility-focused interface patterns. This tool prioritizes clarity and zero-confusion UX over visual creativity.

## Core Design Principles
1. **Extreme Simplicity**: Every element serves a clear purpose - no decorative distractions
2. **Trust & Professionalism**: Clean, credible design that justifies email collection
3. **Beginner-Friendly**: Zero learning curve for first-time website builders
4. **Efficient Hierarchy**: Guide users through the short form with clear visual steps

---

## Typography
- **Primary Font**: Noto Sans TC (繁體中文優化) via Google Fonts CDN
- **Hierarchy**:
  - Page Title: 32px/bold (text-3xl font-bold)
  - Section Headers: 20px/semibold (text-xl font-semibold)  
  - Form Labels: 16px/medium (text-base font-medium)
  - Body Text: 14px/regular (text-sm)
  - Helper Text: 12px/regular (text-xs text-gray-500)

## Layout System
**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16
- Form sections: mb-8
- Input groups: mb-6
- Label-to-input: mb-2
- Icon-to-label: gap-3

**Container Strategy**:
- Single-column centered form: max-w-2xl mx-auto
- Form container padding: p-8 md:p-12
- Page margins: px-4 py-8

---

## Component Library

### 1. Page Structure
- **Header**: Simple logo/title lockup with tagline explaining the tool's purpose
- **Main Form Container**: White card (bg-white shadow-md rounded-lg) on subtle gray background (bg-gray-50)
- **Footer**: Minimal copyright + "報數據" branding link

### 2. Platform Selection (核心組件)
**Design**: 3×2 grid of large, tappable cards
```
Structure per card:
- Platform icon (40×40px, centered)
- Platform name (bold, 16px)
- Brief descriptor (12px, gray)
- Checkbox/toggle state indicator
- Hover: subtle shadow elevation
- Selected: border-2 border-blue-500
```

### 3. Form Inputs
**Text Input Pattern** (for LINE ID, WhatsApp number, etc.):
- Full-width with clear label above
- Input: px-4 py-3 border rounded-md
- Focus: ring-2 ring-blue-500
- Placeholder text in gray-400

**Dropdown** (button position):
- Native select with custom arrow
- Same sizing as text inputs

**Color Picker**:
- Simple color swatch grid (8 preset colors)
- Large tappable swatches (48×48px with rounded corners)
- Selected state: ring-2 ring-offset-2

### 4. Call-to-Action
**Primary Button** ("發送程式碼到我的信箱"):
- Full-width on mobile, auto-width on desktop
- px-8 py-4 text-base font-semibold
- Rounded-md
- High contrast for trust/action

### 5. Trust Indicators
- Security badge icon + "我們絕不會發送垃圾郵件" near email input
- Subtle "完全免費" badge in header
- User count (if available): "已有 1,234 位網站使用"

---

## Email Code Delivery (安裝說明設計)

### Email Structure
1. **Subject**: "您的 ToldYou 聊天按鈕程式碼已準備就緒"

2. **Email Body Sections**:
   - **歡迎訊息**: Brief thank you + what they'll get
   - **程式碼區塊**: 
     - Monospace font (Courier New/Consolas)
     - Light gray background
     - Copy button
   - **安裝說明 (3 tabs)**:
     - **WordPress**: 
       1. 進入「外觀」→「自訂」→「額外的 CSS/JS」
       2. 貼上程式碼到「頁尾程式碼」區域
       3. 點擊「發布」
     - **Shopify**: 
       1. 進入「網路商店」→「佈景主題」→「編輯程式碼」
       2. 找到 theme.liquid 檔案
       3. 在 `</body>` 標籤前貼上程式碼
     - **純 HTML**: 
       1. 開啟您的 HTML 檔案
       2. 在 `</body>` 標籤前貼上程式碼
       3. 儲存並上傳至伺服器
   - **預覽說明**: 上傳後刷新網站即可在右下角/左下角看到按鈕
   - **支援連結**: 附帶聯絡方式

---

## Responsive Breakpoints
- Mobile (< 768px): Single column, larger tap targets
- Desktop (≥ 768px): Maintain max-width container, optimize for quick completion

## Accessibility
- All form inputs with proper labels (for screen readers)
- Sufficient contrast ratios (WCAG AA)
- Keyboard navigation support
- Focus indicators on all interactive elements

---

## Multi-Language Prep (P3 架構預留)
- Language toggle in header (hidden in P1, enabled in P3)
- All text as i18n keys in codebase
- `lang` attribute on `<html>` tag for proper font rendering

## Images
**No hero image needed** - This is a utility form, not a marketing page. Focus remains on the form itself with clean whitespace.