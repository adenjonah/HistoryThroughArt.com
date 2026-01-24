# Modernization Goals

## Primary Objectives

### 1. CMS Migration
**Goal:** Replace static `artworks.json` with a headless CMS

**Why:**
- Current JSON file is 3.4MB and difficult to edit
- No admin interface for content updates
- Changes require code deployment
- No version history or rollback capability

**Success Criteria:**
- [ ] All 250 artworks migrated to CMS with zero data loss
- [ ] Non-technical users can add/edit content via web interface
- [ ] Images hosted on CDN (not in repo)
- [ ] Changes reflect on site without code deployment

---

### 2. UI/UX Modernization
**Goal:** Clean, modern, consistent design system

**Why:**
- Mixed styling (Tailwind + W3.CSS + custom) creates inconsistency
- Some components are visually dated
- Mobile experience could be improved
- Dark purple theme is heavy - could use refresh

**Success Criteria:**
- [ ] Single styling approach (Tailwind only)
- [ ] Consistent component library
- [ ] Improved mobile navigation and touch interactions
- [ ] Refreshed color palette (maintain brand identity)
- [ ] Faster perceived load times

---

### 3. Code Quality & Simplification
**Goal:** Maintainable, well-structured, simpler codebase

**Why:**
- Some components are too large (Flashcards.js = 929 lines)
- Hardcoded data (Korus Array) duplicated across files
- Analytics/debug code adds unnecessary complexity
- No TypeScript (makes refactoring risky)

**Success Criteria:**
- [ ] All components under 200 lines
- [ ] Shared data centralized
- [ ] Analytics removed entirely (Supabase, time tracking, admin dashboard)
- [ ] Debug pages removed or dev-only
- [ ] TypeScript migration (optional, stretch goal)

---

## Secondary Objectives

### 4. Performance
- Lazy load images properly
- Code splitting by route
- Reduce bundle size (audit dependencies)

### 5. SEO & Accessibility
- Proper meta tags for artwork pages
- Alt text for all images
- Keyboard navigation support
- ARIA labels where needed

### 6. Developer Experience
- Consider Vite migration (faster builds)
- Better environment variable handling
- Documented component patterns

---

## Non-Goals (Out of Scope)

- Changing hosting providers (keep Vercel)
- Adding analytics (removing existing analytics for simplicity)
- Adding user accounts/authentication for visitors
- Monetization features
- Mobile app

---

## Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Lighthouse Performance | TBD | 90+ |
| Lighthouse Accessibility | TBD | 95+ |
| Time to add new artwork | ~30 min (requires dev) | ~5 min (CMS) |
| Largest component size | 929 lines | <200 lines |
| Styling approaches | 3 (Tailwind, W3, custom) | 1 (Tailwind) |

---

*Last updated: 2026-01-24*
