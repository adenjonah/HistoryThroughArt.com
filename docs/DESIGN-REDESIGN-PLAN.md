# History Through Art — Design-System Redesign Plan

**Goal:** lift the site from its current ~8.6/10 (post-polish) to a genuine 9.5/10 — the "this was clearly designed by a professional" tier.

**Why incremental CSS can't get there:** the remaining gap is not per-element tweaks; it's the absence of a *system*. Today type sizes, spacing, container widths, card treatments, and icons are decided ad-hoc per page. A 9.5 site reads as one deliberate design language applied consistently. That requires tokens + a few component rewrites, then mechanical application across pages.

Baseline observations (from a full 8-page desktop+mobile review, May 2026):
- **Type:** no scale. Headings use `text-3xl/4xl/5xl` chosen per page; `About.css` uses `em`; no display face — everything is the default sans.
- **Spacing:** section gaps vary (`mb-8` vs `mb-10`), container widths vary (`max-w-2xl`, `4xl`, `6xl`, `7xl`) with no rule for which to use.
- **Color:** 4 flat brand tokens; cards/popovers reuse the same purples, so there's no sense of elevation. Several muted texts (subtitles, "Showing X of Y", weekday headers pre-fix) fail comfortable contrast.
- **Iconography:** Tutorial uses emoji (🎬📚🖼️…); the rest uses `lucide-react`. Inconsistent.
- **Brand:** the wordmark is plain text in the nav; no logo, no favicon/OG strategy observed.

---

## Phase 1 — Foundations: tokens (the highest-leverage work)

Everything else depends on this. Define in `frontend/src/App.css` `:root` (the brand tokens already live there alongside the shadcn HSL vars).

### 1a. Type scale + faces
- Add a display face that suits art history (serif): **Fraunces** or **Spectral** for headings; keep a clean sans (**Inter**) for body. Self-host via `@fontsource` (avoids a Google Fonts request and a CLS hit).
- Tokenize a modular scale (1.25 ratio):
  ```
  --font-display: "Fraunces", Georgia, serif;
  --font-body: "Inter", system-ui, sans-serif;
  --text-xs … --text-5xl  (e.g. 0.8 / 1 / 1.25 / 1.563 / 1.953 / 2.441 / 3.052 rem)
  --leading-tight / --leading-normal; --tracking-tight for display
  ```
- Effort: 0.5 day. Touches `App.css`, `tailwind.config.js` (extend `fontFamily`/`fontSize`), `index.css`.

### 1b. Spacing & layout rhythm
- Adopt one container scale: `--container-prose` (≈65ch), `--container-content` (≈1120px), `--container-wide` (≈1280px). Replace the four ad-hoc `max-w-*` values with these by role.
- A `<PageShell>` wrapper component (header gap, padding, max-width) so every page starts identically. `--page-header-gap` already exists — extend into a full shell.
- Effort: 0.5 day. New `components/PageShell.tsx`; apply to all 8 pages.

### 1c. Color, elevation, contrast
- Keep the dark-purple identity; add a **warm gold accent** (`#c9a24b`-ish) as a secondary — it evokes gilded frames and pairs with the jewel-tone flashcard colors already introduced.
- Define elevation surfaces: `--surface-1/2/3` (the lone `--surface-color: #2d1040` becomes a 3-step ramp) so cards/popovers/modals read as layered, not flat.
- Define text tiers that pass WCAG AA on each surface: `--text-strong / --text-default / --text-muted`. Audit and replace the low-contrast muted texts.
- Effort: 1 day incl. a contrast audit pass.

---

## Phase 2 — Core components (rewrite once, reuse everywhere)

- **Buttons:** consolidate to shadcn variants (`primary` solid, `secondary` outline/ghost, `gold` accent) and use them by role. Removes the per-page `bg-[var(--accent-color)]` overrides (e.g. Home's hand-tuned classes).
- **Card:** one `<Card>` with tokenized radius/shadow/border — unify ArtCard, About FlipCard, Calendar, Identifiers, Tutorial accordion which currently each define their own.
- **Input / Select:** a styled search field with a leading `lucide` Search icon and refined focus ring; matching dropdowns. Fixes the "plain" Gallery control bar.
- **Iconography:** replace all Tutorial emoji with `lucide` icons at a consistent size/stroke; pick a single set site-wide.
- Effort: 2 days.

---

## Phase 3 — Per-surface refinement

| Surface | Work | From → target |
|---|---|---|
| **Home** | Refine scrim→gradient, display-serif headline, gold primary CTA, refined button hierarchy | 9.0 → 9.5 |
| **Gallery** | Custom search field + filter chips, card grid spacing on the new scale, refined "Showing X of Y" | 8.2 → 9.4 |
| **Exhibit** | Balance Identifiers ↔ PhotoGallery columns (equal visual weight), refine the map-type toggle into a segmented control, **conditionally hide the empty video section** when an artwork has no video, tighten vertical rhythm | 8.5 → 9.4 |
| **Calendar** | Already dense; add event-type differentiation (assignment vs quiz color/shape), refine the detail panel empty state | 8.8 → 9.4 |
| **Flashcards** | Tighten card chrome to the new radius/shadow tokens; refine the status line + progress affordance | 8.7 → 9.4 |
| **About** | Consistent photo treatment (the team photos have mismatched backgrounds — consider a unified duotone/tint), display-serif "Our Story", measure-capped prose | 8.7 → 9.4 |
| **Tutorial** | lucide icons replace emoji; stronger accordion borders on the elevation ramp; larger expand/collapse controls | 8.2 → 9.4 |
| **Map** | Already strong; align heading to the display face, refine the legend/toggle to match new components | 9.0 → 9.5 |

Effort: 2–3 days.

---

## Phase 4 — Brand, motion, polish

- **Wordmark/logo:** a simple custom wordmark (display serif + a small mark), favicon, and an OG image template for link sharing.
- **Motion:** consistent transition tokens; honor `prefers-reduced-motion`; subtle route transitions.
- **Imagery:** unify team-photo backgrounds (duotone or removed bg); ensure artwork thumbnails use consistent aspect/hotspot (ArtCard already does — extend the pattern).
- **A11y sweep:** focus-visible states, aria on the icon buttons, color-contrast re-check, keyboard nav on the gallery/flashcards.
- Effort: 1–2 days.

---

## Sequencing & total

1 → 2 → 3 → 4, strictly in order (each phase depends on the prior). **Total ≈ 7–10 focused days.** Phase 1 alone (tokens) plus Phase 2 components would likely move the average to ~9.0–9.2; Phases 3–4 are what earn the last half-point.

## Verification loop (reuse what's already built)
The Playwright screenshot harness from this session (`/tmp/hta-shots/shoot.js`, 8 routes × desktop+mobile, web-security disabled for Sanity CORS) is the regression gate — re-shoot and re-score after each phase. Provide a MapBox dev token in `.env.local` so `/map` and the Exhibit MiniMap render locally (the one piece this session couldn't evaluate). Keep `npm run build` green as the hard gate.

## Risk notes
- Font self-hosting adds ~100–200KB; budget it and subset.
- A `<Card>`/`<PageShell>` refactor touches many files — do it behind the build gate, one surface at a time, screenshotting each.
- The bundle is already 2.3MB (one chunk); a redesign is a good moment to add route-level code-splitting (separate concern, flagged in the build warning).
