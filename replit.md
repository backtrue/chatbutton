# ToldYou Button - 多平台聊天按鈕產生器

## Overview

ToldYou Button is a free multi-platform chat button generator designed specifically for Traditional Chinese, Japanese, and English markets. The tool allows users to create embedded chat widgets that connect to various messaging platforms (LINE, Messenger, WhatsApp, Instagram, etc.) with a simple, one-minute setup process.

**Core Value Proposition:**
- Zero-confusion interface with full Traditional Chinese localization (P1)
- One-click generation of embeddable widget code
- Strategic SEO asset generation through branded backlinks ("報數據" anchor text)
- Future expansion to Japanese and English markets (P3)

**Business Model:**
- P1 (MVP): Free tool that generates backlinks to thinkwithblack.com
- P2 (Planned): SaaS upgrade with user accounts and advanced features
- P3 (Planned): Multi-language expansion (Japanese: "レポートデータ", English: "Report Data")

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **Framework:** React 18+ with TypeScript
- **Routing:** Wouter (lightweight client-side routing)
- **Build Tool:** Vite
- **UI Framework:** shadcn/ui components built on Radix UI primitives
- **Styling:** Tailwind CSS with custom Material Design-inspired theme
- **Form Management:** React Hook Form with Zod validation
- **State Management:** TanStack Query (React Query) for server state

**Design System:**
- Material Design principles with "New York" variant of shadcn/ui
- Custom color system using HSL variables for theme consistency
- Typography optimized for Chinese: Noto Sans TC (Google Fonts)
- Spacing based on Tailwind's 4px grid system
- Mobile-first responsive design

**Key Pages:**
1. **Home (`/`)** - Main configuration form with live preview
2. **Success (`/success`)** - Code delivery and installation instructions
3. **404** - Not found handler

**Component Architecture:**
- Atomic design pattern with reusable UI primitives
- Custom components: `PlatformCard`, `ColorPicker`, `ButtonPreview`
- All form inputs use controlled components with React Hook Form

### Backend Architecture

**Technology Stack:**
- **Runtime:** Node.js with Express
- **Language:** TypeScript (ESM modules)
- **Database ORM:** Drizzle ORM
- **Email Service:** Resend API (abstracted via EmailService interface)
- **Session Management:** Stateless (email-based code delivery)

**API Structure:**
- RESTful API with single endpoint: `POST /api/configs`
- Request validation using Zod schemas
- Response includes both success confirmation and widget code

**Server-Side Rendering:**
- Vite middleware integration for development HMR
- Production serves pre-built static assets
- Express handles API routes and SSR fallback

**Widget Code Generation:**
- Server-side JavaScript generation in `server/widget.ts`
- Embeds user configuration as inline JSON
- Includes branded backlink with language-specific anchor text
- Self-contained script with no external dependencies

**Email Flow:**
1. User submits configuration form
2. Server validates and stores config in database
3. Widget code generated with unique backlink
4. Email sent via Resend with installation instructions
5. Code also returned in API response for immediate use

### Data Storage

**Database:**
- **Provider:** Neon (Serverless PostgreSQL)
- **Connection:** WebSocket-based via `@neondatabase/serverless`
- **Migration Tool:** Drizzle Kit

**Schema Design:**

```typescript
configs table:
- id (UUID primary key, auto-generated)
- email (text, not null)
- configJson (JSONB, stores ButtonConfig)
- lang (text, default 'zh-TW')
- createdAt (timestamp, auto-generated)
```

**ButtonConfig Structure:**
```typescript
{
  platforms: {
    line?: string,
    messenger?: string,
    whatsapp?: string,
    instagram?: string,
    phone?: string,
    email?: string
  },
  position: 'bottom-left' | 'bottom-right',
  color: string (hex format)
}
```

**Storage Layer:**
- Interface-based abstraction (`IStorage`)
- `DatabaseStorage` implementation using Drizzle ORM
- Methods: `createConfig`, `getConfigByEmail`, `getConfigById`

**Data Validation:**
- Schema validation via `drizzle-zod`
- Runtime validation ensures at least one platform is selected
- Email format validation on both client and server

### External Dependencies

**Third-Party Services:**
1. **Neon Database** (via `@neondatabase/serverless`)
   - Serverless PostgreSQL hosting
   - WebSocket connection pooling
   - Required: `DATABASE_URL` environment variable

2. **Resend Email API**
   - Transactional email delivery
   - HTML email templates with installation instructions
   - Required: Resend API key (implementation ready)

3. **Google Fonts CDN**
   - Noto Sans TC for Traditional Chinese typography
   - Preconnected in HTML for performance

**NPM Dependencies:**
- **UI Components:** Extensive use of Radix UI primitives (@radix-ui/*)
- **Form Handling:** react-hook-form, @hookform/resolvers
- **Validation:** zod, drizzle-zod
- **Icons:** lucide-react, react-icons
- **Utilities:** clsx, tailwind-merge, class-variance-authority
- **Date Handling:** date-fns
- **Carousel:** embla-carousel-react

**Build Dependencies:**
- Vite plugins: runtime error overlay, Replit-specific dev tools
- PostCSS with Tailwind and Autoprefixer
- ESBuild for server bundling

**Environment Variables Required:**
- `DATABASE_URL` - Neon database connection string
- `NODE_ENV` - Production/development flag
- Resend API key (when email service is activated)

**SEO Strategy:**
- Generated widgets include hardcoded backlinks to `thinkwithblack.com`
- Anchor text varies by language: "報數據" (zh-TW), "レポートデータ" (ja), "Report Data" (en)
- `rel="noopener"` only (no nofollow/sponsored) to preserve SEO value
- Platform buttons use `rel="noopener noreferrer"` (standard security practice)
- Widget installations create organic backlink network

## Recent Changes

### November 5, 2024 (PM) - Collapsible FAB Widget Redesign

**Major Architecture Change: From Static Buttons to Collapsible FAB**

1. **Platform Brand Colors Implementation:**
   - Created `shared/platformColors.ts` with brand color constants
   - LINE: #06C755, Messenger: #0084FF, WhatsApp: #25D366, Instagram: #E4405F, Phone: #10B981, Email: #6366F1
   - All platform buttons now use official brand colors for better recognition

2. **Enhanced Color Picker:**
   - Added custom color input supporting multiple formats:
     - Hex: #RGB and #RRGGBB (e.g., #f57, #ff5733)
     - RGB: rgb(r, g, b) (e.g., rgb(255, 87, 51))
   - Live color preview square showing current selection
   - Client-side validation with helpful error messages
   - 8 preset colors remain available for quick selection

3. **Schema & Validation Updates:**
   - Updated `shared/schema.ts` to accept Hex/RGB formats
   - Backend normalization in `widget.ts` converts all inputs to #RRGGBB format
   - Ensures consistency across database storage and widget generation

4. **Widget Code Generation (server/widget.ts):**
   - **Complete rewrite to collapsible FAB pattern**
   - DOM structure (append order → visual bottom-to-top):
     1. `platformContainer` - Platform buttons (expand upward, each uses brand color)
     2. `mainButton` - Main FAB trigger (uses user's custom color)
     3. `backlink` - "報數據" SEO link (last element = bottom position)
   - Interaction behaviors:
     - Click main button: toggle expand/collapse
     - Click outside: auto-collapse
     - ESC key: close menu
   - CSS animations: translateY + opacity with 0.18s transitions
   - Staggered animation delay for platform buttons (0.03s per button)
   - Accessibility: `aria-label` and `aria-expanded` attributes

5. **Button Preview Component:**
   - Updated to mirror runtime collapsible behavior
   - Toggle button to preview expand/collapse states
   - Platform buttons show brand colors
   - Main button shows user's custom color
   - "報數據" correctly positioned at bottom

**Testing Results:**
- ✅ E2E test verified full user flow with custom colors (#FF5733, rgb(138,43,226))
- ✅ Color normalization working: rgb(138,43,226) → #8a2be2
- ✅ All platform brand colors correctly rendered in widget code
- ✅ SEO backlink uses rel="noopener" only (no nofollow/sponsored)
- ✅ DOM append order confirmed: platformContainer → mainButton → backlink
- ✅ Cross-format color input validated

**Architecture Review:**
- Architect: PASS - All requirements fulfilled
- Security: No issues observed
- Recommended: Monitor cross-browser animation performance post-deployment

### November 5, 2024 (AM) - P1 MVP Complete

**All Core Features Implemented:**

1. **Frontend Fixes:**
   - Fixed data-testid naming conflict between platform inputs and email input
   - Platform inputs now use `input-platform-${id}` pattern
   - Added `useLocation` from wouter for client-side navigation
   - Fixed API response parsing: `await response.json()` to extract widget code
   - Removed debug logging after testing complete
   - **Fixed widget layout**: Changed from `flex-direction:column-reverse` to `flex-direction:column`
   - **Backlink position**: "報數據" now correctly appears ABOVE platform buttons (not below)

2. **Success Page Implementation:**
   - Created complete `/success` route with installation instructions
   - SessionStorage-based code transfer from Home to Success page
   - Three installation guides: WordPress, Shopify, HTML
   - Copy-to-clipboard functionality with visual feedback
   - "Create another button" navigation back to home

3. **Button Preview Component:**
   - Fixed to display ALL selected platforms (removed `.slice(0, 4)` limit)
   - Added data-testid attributes to all preview elements
   - Displays SEO backlink "報數據" in preview

4. **Data-testid Instrumentation:**
   - All interactive elements properly tagged for E2E testing
   - Platform cards: `platform-card-${id}`
   - Platform inputs: `input-platform-${id}`
   - Email input: `input-email`
   - Position buttons: `button-position-left/right`
   - Submit button: `button-submit`
   - Success page elements: `text-widget-code`, `button-copy-code`, `button-create-another`
   - Preview elements: `preview-button-${id}`, `preview-backlink`

5. **SEO Backlink Implementation:**
   - Widget backlink correctly uses `rel="noopener"` (NO nofollow/sponsored)
   - Platform buttons use `rel="noopener noreferrer"` for security
   - Verified through E2E testing

**Testing Status:**
- E2E tests confirm full user flow working: form submission → database storage → widget generation → success page display
- SEO backlink strategy correctly implemented
- All PRD requirements met for P1 MVP

**Known Issues:**
- Playwright test agent incorrectly flags "noreferrer" as containing "nofollow" (false positive)
- This is a test harness bug, not an application bug
- Manual verification confirms no "nofollow" or "sponsored" attributes in backlink