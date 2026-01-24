# HistoryThroughArt.com Modernization Project

This directory contains planning documents for the major UI/UX modernization and CMS migration.

## Current State Summary

| Aspect | Current | Target |
|--------|---------|--------|
| **Framework** | React 18 + CRA (rewired) | React 18 + Vite (or keep CRA) |
| **Styling** | Tailwind + W3.CSS + custom CSS (mixed) | Tailwind only (unified) |
| **Data Storage** | Static JSON (3.4MB, 250 artworks) | Headless CMS |
| **Hosting** | Vercel | Vercel (no change) |
| **Backend** | Supabase (analytics) | None (CMS only) |

## Documents

| File | Purpose |
|------|---------|
| [GOALS.md](./GOALS.md) | High-level objectives and success criteria |
| [TASKS.md](./TASKS.md) | Detailed task breakdown by phase |
| [CMS-OPTIONS.md](./CMS-OPTIONS.md) | CMS evaluation and recommendation |
| [CURRENT-STATE.md](./CURRENT-STATE.md) | Technical audit of existing codebase |

## Key Constraints

1. **Live site with active users** - Changes must be incremental, no extended downtime
2. **Simple hosting** - Keep Vercel, avoid complex infrastructure
3. **Free CMS tier** - Budget-conscious, leverage free tiers
4. **Preserve all content** - 250 artworks with images, videos, transcripts must migrate cleanly

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-01-24 | Initiated modernization planning | UI/UX outdated, JSON data hard to maintain |
| 2026-01-24 | Remove analytics entirely | Simplification - remove Supabase, admin dashboard, time tracking |

---

*Last updated: 2026-01-24*
