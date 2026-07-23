# Clerk Authentication Implementation Prompt

## Goal
Implement Clerk Authentication for **biasly** / **PERSPECTIVE** news analysis platform using `@clerk/nextjs`. The authentication integration must provide seamless user sign-in, sign-up, user profile management, session state handling, middleware protection, and client/server component auth hooks while matching the application's clean design system.

## Skills Read
- `.agents/skills/clerk`
- `.agents/skills/clerk-setup`
- `.agents/skills/clerk-nextjs-patterns`

## Existing Code Inspected
- `package.json` (Next.js 16.2.10, React 19.2.4)
- `app/layout.tsx` (Root layout where `<ClerkProvider>` is placed inside `<body>`)
- `components/home/main-nav.tsx` (Main navigation header containing Login and CTA buttons)
- `components/home/header-utility-bar.tsx` (Top utility header bar)
- `app/page.tsx` (Home page)
- `.env.local` (Environment configuration for API keys)

## Decisions & Assumptions
- SDK package to install: `@clerk/nextjs` (latest standard v6/v7 matching Next.js 16).
- Clerk publishable and secret keys will be set up in `.env.local` (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`, `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`).
- `ClerkProvider` must wrap the app children inside `<body>` in `app/layout.tsx` (not wrapping `<html>`).
- Next.js middleware using `clerkMiddleware()` will be created in `middleware.ts` to attach auth context across routes.
- Navigation header in `components/home/main-nav.tsx` will be updated with dynamic authentication state:
  - `<SignedOut>` state: Show "Login" button wrapped in `<SignInButton mode="modal">`.
  - `<SignedIn>` state: Show `<UserButton />` with user avatar & account dropdown menu alongside existing actions.
- Dedicated sign-in and sign-up catch-all routes will be created (`app/sign-in/[[...sign-in]]/page.tsx` and `app/sign-up/[[...sign-up]]/page.tsx`) rendering Clerk's `<SignIn />` and `<SignUp />` components styled with dark/light theme options matching the app aesthetic.

## Visual Interpretation & Specifications

### 1. Header Navigation Integration
- **Signed Out State**:
  - The `Login` button in `components/home/main-nav.tsx` will trigger Clerk modal sign-in via `<SignInButton mode="modal">`.
  - Styled with border `border-[#D1D5DB]`, text `#0D0D0F`, hover background `#F9FAFB`, matching the current button tokens.
- **Signed In State**:
  - The `Login` button is replaced by `<UserButton />` with avatar ring and user profile menu.
  - Aligned cleanly next to the "Subscribe" CTA button in the header right actions section.

### 2. Sign-In & Sign-Up Pages
- Clean centered layout on `/sign-in` and `/sign-up` routes.
- Centered container (`min-h-screen flex items-center justify-center bg-[var(--bg-secondary)] p-4`).
- Render `<SignIn routing="path" path="/sign-in" />` and `<SignUp routing="path" path="/sign-up" />`.

## Files Likely to Change
- `package.json` [MODIFY] (Add `@clerk/nextjs` dependency)
- `.env.local` [MODIFY] (Add Clerk publishable and secret key placeholders)
- `middleware.ts` [NEW] (Add Clerk middleware with matcher configuration)
- `app/layout.tsx` [MODIFY] (Wrap body content with `<ClerkProvider>`)
- `components/home/main-nav.tsx` [MODIFY] (Integrate `<SignedIn>`, `<SignedOut>`, `<SignInButton>`, `<UserButton>`)
- `app/sign-in/[[...sign-in]]/page.tsx` [NEW] (Dedicated sign-in page)
- `app/sign-up/[[...sign-up]]/page.tsx` [NEW] (Dedicated sign-up page)

## Implementation Requirements
1. Install `@clerk/nextjs` into dependencies.
2. Update `.env.local` with standard Clerk environment variables:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`
   - `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`
3. Configure `middleware.ts` using `clerkMiddleware()` from `@clerk/nextjs/server` with comprehensive matcher pattern covering pages and API routes.
4. Wrap `app/layout.tsx` inside `<body>` with `<ClerkProvider>`.
5. Update `components/home/main-nav.tsx` to conditionally render `<SignedOut>` (with `<SignInButton mode="modal">`) and `<SignedIn>` (with `<UserButton />`).
6. Create `app/sign-in/[[...sign-in]]/page.tsx` and `app/sign-up/[[...sign-up]]/page.tsx` for fallback full-page authentication.
7. Ensure clean compilation without TypeScript or build errors.

## Security Requirements
- Ensure `CLERK_SECRET_KEY` is kept strictly server-side and never exposed to client bundles.
- Use `await auth()` for server-side auth checks and `useAuth()` / `useUser()` for client components.
- Protect administrative or API routes as required by project specs.

## Acceptance Criteria
- `@clerk/nextjs` is installed and properly configured.
- `ClerkProvider` wraps the application in `app/layout.tsx`.
- `middleware.ts` processes requests without blocking public routes like `/` or `/article/*`.
- Clicking "Login" in the header opens the Clerk sign-in modal.
- User profile (`<UserButton />`) displays when a user is signed in.
- Full page routes `/sign-in` and `/sign-up` render Clerk components seamlessly.
- Project builds cleanly with `npm run build` and passes `npm run lint`.

## Checks to Run
- `npm run build`
- `npm run lint`

## Exact Manual Test Steps Expected After Implementation
1. Ensure `.env.local` contains valid or development `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`.
2. Start dev server: `npm run dev`.
3. Open browser at `http://localhost:3000`.
4. Verify "Login" button is visible in the top header.
5. Click "Login" and verify the Clerk authentication modal appears.
6. Test navigating directly to `http://localhost:3000/sign-in` and `http://localhost:3000/sign-up` to verify custom auth page rendering.
7. Perform sign-in / sign-up and confirm that the header switches from "Login" to the user avatar icon (`<UserButton />`).
8. Click `<UserButton />` to verify account management dropdown options (Manage account, Sign out).
9. Test sign out and confirm header reverts to "Login".
