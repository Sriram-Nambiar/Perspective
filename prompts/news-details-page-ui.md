# News Details Page UI Implementation Prompt

## Goal
Implement the pixel-perfect **News Details Page** for **biasly** / **PERSPECTIVE** news analysis platform based on the provided reference screenshot. The page features article breadcrumbs, full article title and metadata, inline bias distribution bar, article main content with inline quote callout, related stories grid, right sidebar with Bias Analysis card, AI Summary card, and Source Breakdown table, email newsletter subscription banner with monument skyline graphic, and the global header and dark footer.

## Skills Read
- Next.js documentation in `node_modules/next/dist/docs/`
- `.agents/skills/clerk`

## Existing Code Inspected
- `app/globals.css` (Tailwind CSS configuration & typography tokens)
- `app/layout.tsx` (Root layout & font setup)
- `components/home/header-utility-bar.tsx` (Top utility bar)
- `components/home/main-nav.tsx` (Main header & navigation bar)
- `components/home/topic-pills-bar.tsx` (Topic pills strip)
- `components/home/home-footer.tsx` (Dark footer)
- `components/ui/monument-skyline.tsx` (Monument skyline SVG graphic)
- `components/ui/bias-meter.tsx` (BiasMeter UI component)
- `components/home/home-card.tsx` (News card component)
- `app/page.tsx` (Home page component)

## Visual Interpretation & Specifications

### 1. Layout & Structure
- **Container**: Max width `max-w-[1280px]` centered with `px-4 md:px-8 py-6 md:py-8`.
- **Grid Layout**: Main content area split into two columns on desktop (`grid grid-cols-1 lg:grid-cols-12 gap-8`):
  - Left/Main Column: `lg:col-span-8` (~66% width) containing breadcrumbs, headline, author/meta/share bar, featured image + caption, inline bias distribution box, full article content, quote block, and related stories grid.
  - Right Sidebar Column: `lg:col-span-4` (~33% width) containing stacked cards: Bias Analysis card, AI Summary card, and Source Breakdown card.
  - Bottom Banner: Full width `Stay Informed. Stay Balanced.` newsletter strip above the global dark footer.

### 2. Main Article Components (Left Column)
- **Breadcrumbs**: Chevron-separated path `Home > India > Agriculture` with gray arrows and hover states.
- **Headline**: Bold headline title `Centre Approves ₹2.4 Lakh Crore Scheme to Boost Farmer Income` (`text-2xl md:text-[32px] font-bold leading-tight text-[#0D0D0F]`).
- **Author & Meta Bar**:
  - Left side: `By Ananya Sharma | May 31, 2026 | 10 min read` in muted gray (`#6B7280`).
  - Right side: Action triggers `Save [Bookmark Icon] | Share [Share Icon] [...]` with interactive bookmark & share actions.
- **Featured Image**:
  - Image of farmer inspecting crops in a green field at sunrise.
  - Caption: `A farmer inspects his crop at a field in Punjab. The new scheme aims to double farmers' income by 2030.`
  - Photo Credit: `Photo: PTI`
- **Inline Bias Distribution Box**:
  - Clean card with light gray border (`border-[#E5E7EB] rounded-lg p-4 bg-white`).
  - Header: `Bias Distribution (i)` tooltip info icon.
  - Tri-color segmented bar: Left 18% (`#B42318`), Center 42% (`#E5E7EB` or `#9CA3AF`), Right 40% (`#1D4ED8`).
  - Footer label: `7 sources`.
- **Article Paragraphs & Quote Callout**:
  - Rich formatted paragraphs detailing the PM Kisan Samriddhi Yojana.
  - Block quote / statement: `"This initiative reflects our commitment to the annadata of the nation. Our goal is to double farmers' income by 2030," Prime Minister Narendra Modi said while addressing a farmers' gathering in Varanasi via video conference.`
- **Related Stories Section**:
  - Heading: `Related Stories` (`text-xl font-bold`).
  - Grid: 2-column grid (`grid grid-cols-1 md:grid-cols-2 gap-4`) rendering 6 related story cards with thumbnail image, category/topic tags, title, date, and read time.

### 3. Sidebar Components (Right Column)
- **Bias Analysis Card**:
  - Title: `Bias Analysis` with `(i)` info icon tooltip.
  - Overall Bias: **`Right 40%`** in bold navy blue (`text-2xl md:text-3xl font-bold text-[#1D4ED8]`).
  - Subtitle: `Based on 7 balanced sources` (clickable link).
  - Breakdown Bars:
    - Left 18% (red `#B42318`)
    - Center 42% (gray `#E5E7EB`)
    - Right 40% (navy `#1D4ED8`)
  - Description: `Our analysis is based on the political leaning of the publication and how the story is framed. Sources are weighted by reliability and recency.`
  - Button: Outlined full-width button `How We Analyze Bias`.
- **AI Summary Card**:
  - Title: `AI Summary` with `(i)` info icon.
  - Meta: `Generated May 31, 2026 • 3 min read`.
  - Bullet points listing key executive summary items of the scheme.
  - Disclaimer: `AI summaries can make mistakes.`
  - Button: Outlined full-width button `Provide Feedback`.
- **Source Breakdown Card**:
  - Title: `Source Breakdown` with `(i)` info icon.
  - Subtitle: `7 Total Sources`.
  - Segment count breakdown (Left: 1 (18%), Center: 3 (42%), Right: 3 (40%)).
  - Source publisher table:
    - The Hindu → `Right` (blue text)
    - Times of India → `Center` (gray text)
    - Business Standard → `Center` (gray text)
    - NDTV → `Right` (blue text)
    - Hindustan Times → `Center` (gray text)
    - The Indian Express → `Left` (red text)
    - News18 → `Center` (gray text)
  - Button: Outlined full-width button `View All Sources`.

### 4. Newsletter Banner Strip
- Card container with light background (`bg-[#F3F4F6] border border-[#E5E7EB] rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6`).
- Left side: Monument skyline illustration graphic + Title `Stay Informed. Stay Balanced.` + Subtitle `Get the top stories and bias analysis delivered to your inbox.`
- Right side: Email input box (`Enter your email`) + `Subscribe` button (solid black `#0D0D0F`).

## Files Likely to Change
- `app/article/[id]/page.tsx` [NEW] (or `app/article/page.tsx` [NEW] for detail view)
- `components/article/article-header.tsx` [NEW]
- `components/article/inline-bias-box.tsx` [NEW]
- `components/article/related-stories.tsx` [NEW]
- `components/article/sidebar-bias-analysis.tsx` [NEW]
- `components/article/sidebar-ai-summary.tsx` [NEW]
- `components/article/sidebar-source-breakdown.tsx` [NEW]
- `components/article/newsletter-banner.tsx` [NEW]
- `components/home/home-card.tsx` [MODIFY] (Link cards to detail page route `/article/2`)

## Security Requirements
- Ensure Clerk authentication triggers and interactive buttons adhere to standard client/server boundary rules.

## Acceptance Criteria
- Pixel-perfect representation of the provided reference screenshot.
- Full responsive layout (desktop 2-column sidebar, tablet/mobile stacked columns).
- Complete article text, quote block, caption, and metadata rendered cleanly.
- All sidebar cards (Bias Analysis, AI Summary, Source Breakdown) with exact values, color bars, and publisher listing.
- Interactive components: bookmark toggle, share toast/modal trigger, email subscribe input.
- Clean Next.js build (`npm run build`) and lint (`npm run lint`).

## Checks to Run
- `npm run build`
- `npm run lint`

## Exact Manual Test Steps Expected After Implementation
1. Run `npm run dev` and navigate to `http://localhost:3000`.
2. Click on the news card titled "Centre Approves ₹2.4 Lakh Crore Scheme to Boost Farmer Income" (or go directly to `http://localhost:3000/article/2`).
3. Verify top breadcrumbs `Home > India > Agriculture`.
4. Inspect main article headline, author line, action bar (Save / Share), featured image, photo credit, and inline Bias Distribution card.
5. Scroll down through article text, quote block, and 6-card Related Stories grid.
6. Inspect the right sidebar cards: Bias Analysis (Right 40%), AI Summary bullet points, and Source Breakdown table showing publisher bias tags.
7. Verify the bottom newsletter banner (`Stay Informed. Stay Balanced.`) with monument skyline graphic and email subscribe box.
8. Check responsiveness on mobile viewports.
