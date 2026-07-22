# Home Page UI Implementation Prompt

## Goal
Implement the full home page for **biasly** / **PERSPECTIVE** news platform based on the provided reference UI layout, featuring top utility header bar, main navigation bar with Clerk authentication actions, sub-topic category pills bar, 3-column top news article grid with bias meters, and dark multi-column footer.

## Skills Read
- Next.js documentation in `node_modules/next/dist/docs/`
- `.agents/skills/clerk`

## Existing Code Inspected
- `app/globals.css` (Tailwind CSS configuration & design system CSS tokens)
- `app/layout.tsx` (Poppins font setup)
- `components/ui/bias-meter.tsx` (BiasMeter bar component)
- `components/ui/news-card.tsx` (NewsCard component)
- `app/page.tsx` (Current layout & mock structure)

## Visual Interpretation & Specifications
- **Layout & Structure**:
  - Container max-width: `max-w-[1280px]` centered with subtle padding.
  - Background: Clean off-white/light gray (`bg-[#F9FAFB]` / `#F4F4F5`).
  - Top Utility Header Bar: Date `Mon, June 1, 2026`, Location `Set Location`, Dropdown `India Edition ∨`, Theme selector (`Light / Dark / Auto`).
  - Main Nav Header: Hamburger menu icon, PERSPECTIVE logo with sub-text tagline "Balanced news. Clearer perspective.", Nav items (`Home`, `For You` with red dot indicator, `India`, `States`, `Business`, `Technology`, `Sports`, `Entertainment`), `Subscribe` button (solid black `#0D0D0F`), `Login` button (outlined `#E5E7EB`).
  - Category Strip: Scalable horizontal pill strip with left/right scroll controls and `+` action buttons on category pills (`India +`, `Politics +`, `Business +`, `Markets +`, `Bollywood +`, `Cricket +`, `Health +`, `Education +`, `Science +`, `Startups +`, `More +`).
  - Top News Header: `Top News` bold title.
  - News Grid: Responsive 3-column grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`).
  - News Cards: Vertical card aspect ratio (~200px image with `(i)` info icon at top right, tag breadcrumbs `Politics • India`, bold headline title, `BiasMeter` with Left/Center/Right % and colors `#B42318`, `#E5E7EB`, `#1D4ED8`, footer with `XX sources`).
  - Footer: Dark background `#0D0D0F`, brand logo & social icons, 3 navigation link columns (Company, Help, Connect), bottom legal bar with `© 2026 Perspective News. All rights reserved.` and `Made with ❤️ in India`.

## Files Likely to Change
- `components/home/header-utility-bar.tsx` [NEW]
- `components/home/main-nav.tsx` [NEW]
- `components/home/topic-pills-bar.tsx` [NEW]
- `components/home/home-card.tsx` [NEW]
- `components/home/home-footer.tsx` [NEW]
- `app/page.tsx` [MODIFY]

## Security Requirements
- Ensure Clerk authentication components / login triggers are clean and adhere to standard client/server boundary rules.

## Acceptance Criteria
- Pixel-perfect representation of the provided reference screenshot.
- Full 12 sample news articles rendered accurately with correct categories, titles, bias percentages, and source counts.
- Interactive category pill scrolling and selection.
- Clean Next.js build (`npm run build`) and lint (`npm run lint`).

## Checks to Run
- `npm run build`
- `npm run lint`

## Exact Manual Test Steps Expected After Implementation
1. Run `npm run dev` and open `http://localhost:3000`.
2. Inspect top utility header, date, theme toggler, and edition dropdown.
3. Verify main header with logo, navigation links, Subscribe, and Login button.
4. Click through topic pills and verify left/right scroll buttons.
5. Inspect the 12 news cards in the "Top News" grid: check images, titles, bias meter bars, and source counts.
6. Scroll down to verify the dark footer links, social icons, and copyright text.
