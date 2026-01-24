# Task Breakdown

## Phase 0: Preparation
*Do this before any code changes*

### 0.1 Audit & Baseline
- [ ] Run Lighthouse audit, document current scores
- [ ] Document all current routes and their functionality
- [ ] Inventory all JSON data fields and their usage
- [ ] Screenshot current UI for reference
- [ ] Create feature branch for modernization work

### 0.2 CMS Selection
- [ ] Review CMS options (see [CMS-OPTIONS.md](./CMS-OPTIONS.md))
- [ ] Create test project on chosen CMS
- [ ] Design content model (artwork schema)
- [ ] Test API access from local dev
- [ ] **DECISION CHECKPOINT:** Confirm CMS choice

---

## Phase 1: CMS Migration
*Get data out of JSON without changing UI*

### 1.1 Content Model Setup
- [ ] Create artwork content type in CMS with all fields:
  - id, name, artist_culture, date, location, materials
  - unit, museum, displayedLocation
  - coordinates (displayed + originated)
  - images (array), videoLinks (array), transcripts (array)
  - language (optional)
- [ ] Create content area/unit reference type (1-10)
- [ ] Set up image CDN/media library

### 1.2 Data Migration
- [ ] Write migration script: JSON → CMS
- [ ] Migrate all 250 artworks
- [ ] Upload all 407 images to CMS media library
- [ ] Verify data integrity (spot check 10-20 artworks)
- [ ] Migrate DueDates.json data (if keeping calendar feature)

### 1.3 API Integration
- [ ] Create CMS client utility (`/utils/cmsClient.js`)
- [ ] Implement artwork fetching functions:
  - `getAllArtworks()`
  - `getArtworkById(id)`
  - `getArtworksByUnit(unit)`
  - `searchArtworks(query)`
- [ ] Add caching layer (avoid excessive API calls)
- [ ] Update components to use CMS client instead of JSON import

### 1.4 Korus Order
- [ ] Decide: Store order in CMS or keep as config?
- [ ] If CMS: Add `korusOrder` field to artworks
- [ ] If config: Centralize to single source file

### 1.5 Testing & Cutover
- [ ] Test all pages with CMS data
- [ ] Performance test (compare to JSON load times)
- [ ] Remove `artworks.json` from bundle
- [ ] Deploy CMS-powered version
- [ ] Monitor for issues

---

## Phase 2: Styling Consolidation
*Unify to Tailwind only*

### 2.1 Audit Current Styles
- [ ] List all W3.CSS classes in use
- [ ] List all custom CSS classes in use
- [ ] Identify components using inline styles
- [ ] Map W3 classes to Tailwind equivalents

### 2.2 Create Design Tokens
- [ ] Define color palette in `tailwind.config.js`
- [ ] Define spacing scale
- [ ] Define typography scale
- [ ] Define breakpoints (keep Tailwind defaults or customize)

### 2.3 Component-by-Component Migration
- [ ] NavBar - convert to Tailwind
- [ ] Home page - convert to Tailwind
- [ ] ArtCard - convert to Tailwind
- [ ] Catalog/Gallery - convert to Tailwind
- [ ] Exhibit page components - convert to Tailwind
- [ ] Flashcards - convert to Tailwind
- [ ] Map page - convert to Tailwind
- [ ] Calendar - convert to Tailwind
- [ ] About page - convert to Tailwind

### 2.4 Cleanup
- [ ] Remove `w3.css` file
- [ ] Remove unused CSS from `App.css`
- [ ] Remove Emotion/styled-components if no longer needed
- [ ] Audit for any remaining non-Tailwind styles

---

## Phase 3: Component Refactoring
*Break up large components, improve structure*

### 3.1 Flashcards Refactor (929 lines → multiple files)
- [ ] Extract: `FlashcardDeck.js` (card display logic)
- [ ] Extract: `FlashcardControls.js` (buttons, filters)
- [ ] Extract: `useFlashcardState.js` (custom hook for state)
- [ ] Extract: `flashcardUtils.js` (shuffle, filter functions)
- [ ] Keep: `Flashcards.js` as orchestrator (<100 lines)

### 3.2 Exhibit Page Refactor
- [ ] Review current component split (already modular)
- [ ] Extract any remaining large sections
- [ ] Improve prop drilling (consider context if needed)

### 3.3 Remove Analytics (Simplification)
- [ ] Remove `/pages/Admin/` directory entirely
  - `AdminDashboard.js` (576 lines)
  - `DebugPage.js` (313 lines)
  - `index.js`
- [ ] Remove `/pages/SupabaseDebug.js` (785 lines)
- [ ] Remove analytics components:
  - `components/AdminLogin.js`
  - `components/AnalyticsCharts.js`
  - `components/SessionsTable.js`
  - `components/UserStats.js`
- [ ] Remove analytics utilities:
  - `utils/supabaseClient.js`
  - `utils/analyticsService.js`
  - `utils/authService.js`
  - `utils/timeTracker.js` (37 KB)
- [ ] Remove routes: `/admin`, `/admin/debug`, `/admin/supabase-debug`
- [ ] Remove Supabase SDK from dependencies (`@supabase/supabase-js`)
- [ ] Remove Chart.js dependencies (`chart.js`, `react-chartjs-2`)
- [ ] Remove environment variables:
  - `REACT_APP_SUPABASE_URL`
  - `REACT_APP_SUPABASE_ANON_KEY`
- [ ] Remove TimeTracker initialization from `index.js`
- [ ] Update NavBar (remove admin link if present)

### 3.4 Centralize Shared Data
- [ ] Move Korus Array to `/data/korusOrder.js`
- [ ] Move content areas to `/data/contentAreas.js`
- [ ] Update all imports

### 3.5 Clean Up Debug Code
- [ ] Remove debug console.logs from production components
- [ ] Remove any remaining debug utilities

---

## Phase 4: UI/UX Enhancements
*Visual refresh and UX improvements*

### 4.1 Design Refresh
- [ ] Review/refresh color palette
- [ ] Update Home page hero design
- [ ] Modernize card components
- [ ] Improve button styles
- [ ] Add subtle animations/transitions

### 4.2 Navigation Improvements
- [ ] Improve mobile menu UX
- [ ] Add breadcrumbs to Exhibit pages
- [ ] Improve back/forward navigation in Exhibit
- [ ] Add keyboard shortcuts for power users

### 4.3 Gallery/Catalog Improvements
- [ ] Improve grid layout responsiveness
- [ ] Add image lazy loading with blur placeholder
- [ ] Improve filter UX (collapsible on mobile)
- [ ] Add "recently viewed" section

### 4.4 Flashcard Improvements
- [ ] Improve swipe gesture feedback
- [ ] Add progress indicator
- [ ] Add session summary at end
- [ ] Improve touch targets on mobile

### 4.5 Map Improvements
- [ ] Review Mapbox integration (consolidate versions)
- [ ] Improve marker clustering
- [ ] Add artwork preview on marker hover/click

---

## Phase 5: Performance & Polish
*Optimization and final touches*

### 5.1 Performance
- [ ] Implement route-based code splitting
- [ ] Audit and remove unused dependencies
- [ ] Optimize images (if not handled by CMS CDN)
- [ ] Add loading skeletons
- [ ] Implement proper error boundaries

### 5.2 SEO
- [ ] Add meta tags to artwork pages
- [ ] Implement Open Graph tags for sharing
- [ ] Add structured data (JSON-LD) for artworks
- [ ] Generate sitemap

### 5.3 Accessibility
- [ ] Audit with axe or similar tool
- [ ] Fix any ARIA issues
- [ ] Ensure keyboard navigation works
- [ ] Add skip links
- [ ] Test with screen reader

### 5.4 Documentation
- [ ] Update README with new architecture
- [ ] Document CMS content model
- [ ] Create contributor guide
- [ ] Document deployment process

---

## Optional/Stretch Goals

### TypeScript Migration
- [ ] Add TypeScript to project
- [ ] Convert utilities first
- [ ] Convert components incrementally
- [ ] Add strict mode

### Vite Migration
- [ ] Evaluate migration effort
- [ ] Test build with Vite
- [ ] Update deployment config

---

## Task Dependencies

```
Phase 0 ─────┬──────► Phase 1 (CMS)
             │              │
             │              ▼
             └──────► Phase 2 (Styling) ──► Phase 3 (Refactor)
                                                  │
                                                  ▼
                                           Phase 4 (UI/UX)
                                                  │
                                                  ▼
                                           Phase 5 (Polish)
```

Phase 1 and Phase 2 can run in parallel after Phase 0.
Phase 3-5 should be sequential.

---

*Last updated: 2026-01-24*
