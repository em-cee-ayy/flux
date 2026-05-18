# Vite → Next.js Migration Design

**Date:** 2026-05-18
**Approach:** Option A — In-place migration (minimal disruption)

## Goal

Migrate Flux from a Vite + React SPA to Next.js App Router so the `/api/analyze` route handler can run server-side with access to `ANTHROPIC_API_KEY`. The app remains a client-side SPA — no server rendering of UI screens.

## Files Added

| File | Purpose |
|---|---|
| `src/app/layout.tsx` | Root layout — sets `<html lang="en">`, `<body>`, imports global CSS (`src/styles/index.css`). Replicates the inline styles from `index.html` (max-width 480px on desktop, border/shadow) as a `<div>` wrapper. |
| `src/app/page.tsx` | Home route — thin server component that renders `<App />`. No logic. |
| `next.config.ts` | Minimal Next.js config — no custom settings needed at this stage. |
| `.env.local` | `ANTHROPIC_API_KEY=sk-ant-...` — gitignored, read server-side by the route handler. |

## Files Modified

### `package.json`
- **Add:** `next` (latest)
- **Remove:** `vite`, `@vitejs/plugin-react`, `@tailwindcss/vite`
- **Add devDep:** `@tailwindcss/postcss`
- **Update scripts:**
  ```json
  "dev": "next dev",
  "build": "next build",
  "start": "next start"
  ```
- Keep all other dependencies unchanged.

### `tsconfig.json`
- Remove `"vite/client"` from `types` array
- Add `"next"` to `types` array
- All other options (`moduleResolution: "bundler"`, `paths`, `baseUrl`) remain unchanged — Next.js 14+ supports bundler module resolution.

### `postcss.config.mjs`
- Add `@tailwindcss/postcss` as a plugin so Tailwind v4 works without the Vite plugin.

### `src/app/App.tsx`
- Add `'use client'` as the first line. All child components (BrainDump, VibeCheck, etc.) inherit client-component status automatically — no changes needed in any other component file.

## Files Deleted

| File | Reason |
|---|---|
| `vite.config.ts` | Replaced by `next.config.ts` |
| `index.html` | Next.js generates the HTML shell via `layout.tsx` |
| `src/main.tsx` | Vite entry point — no longer needed; CSS import moves to `layout.tsx` |

## Files Untouched

- `src/app/components/**` — all screen components, all shadcn/ui components
- `src/app/lib/ai.ts`, `src/app/lib/types.ts`
- `src/app/api/analyze/route.ts` — already in Next.js App Router format
- `src/styles/**` — all CSS files; the Tailwind v4 `@import` syntax works identically with PostCSS
- `public/illustrations/**` — Next.js serves `public/` identically to Vite

## CSS Import Chain

Currently `src/main.tsx` imports `src/styles/index.css`. After migration:
- `src/main.tsx` is deleted (no entry point needed)
- `src/app/layout.tsx` imports `'../styles/index.css'` instead

No CSS file contents change.

## Desktop Shell Styles

`index.html` contains inline styles that constrain the app to 480px on desktop with a border and shadow. These move into a wrapper `<div>` in `layout.tsx`:

The constraint applies only on wider screens (matching the original `@media (min-width: 768px)` in `index.html`). Use a Tailwind class rather than inline style:

```tsx
<div className="md:max-w-[480px] md:mx-auto md:min-h-screen md:border-x md:border-gray-200 md:shadow-[0_0_20px_rgba(0,0,0,0.1)]">
  {children}
</div>
```

The `html`/`body` margin/padding reset stays in `src/styles/index.css` (already present via Tailwind base styles).

## Environment

`.env.local` is already gitignored by Next.js's default `.gitignore`. If `.gitignore` doesn't exist yet, it will be created as part of `next` installation or manually added.

## Out of Scope

- Server Components for any UI screen
- Supabase or any other backend integration
- Deployment configuration (Vercel, etc.)
- Route changes or new pages
