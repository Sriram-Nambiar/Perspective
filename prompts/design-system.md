# Design System Implementation Prompt (Updated Reference)

## Goal
Update the **biasly** design system and UI tokens according to the revised reference specification, incorporating the Indian architectural monument skyline watermark graphics in the Brand Card and Footer, as well as the updated India economic news card example ("India's GDP Growth Revised Upward to 7% for FY25: Report").

## Skills Read
- Next.js documentation in `node_modules/next/dist/docs/`

## Existing Code Inspected
- `app/globals.css` (Tailwind CSS tokens and rules)
- `app/layout.tsx` (Poppins font setup)
- `components/ui/news-card.tsx` (NewsCard component)
- `app/page.tsx` (Design System Showcase page)

## Decisions and Assumptions
- Create an SVG monument skyline component (`components/ui/monument-skyline.tsx`) that renders subtle architectural silhouettes (India Gate, Taj Mahal, temple domes, Ashoka Chakra outline) both in light mode for the Brand Card watermark and in dark mode for the dark Footer bar.
- Update `NewsCard` default sample props or usage in `app/page.tsx` to match the new reference:
  - Category: `India`
  - Source: `Politics`
  - Title: `India's GDP Growth Revised Upward to 7% for FY25: Report`
  - Excerpt: `The report highlights strong domestic demand, improved manufacturing output and robust service sector performance.`
  - Image: PM Modi / India context photo
  - Bias Meter: Left 25%, Center 50%, Right 25%
  - Meta: `2h ago`, `8 min read`

## Files Likely to Change
- `components/ui/monument-skyline.tsx` [NEW]
- `components/ui/news-card.tsx`
- `app/page.tsx`

## Acceptance Criteria
- Clean SVG skyline watermark rendered in Brand Card and Footer.
- Updated Card Example rendering exact updated copy, category, and 8 min read metadata.
- Clean build (`npm run build`) and clean lint (`npm run lint`).

