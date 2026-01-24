# Current Technical State

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18.2.0 |
| Build Tool | Create React App (via react-app-rewired) |
| Routing | React Router DOM 6.23.1 |
| Styling | Tailwind CSS 3.4.16 + W3.CSS + Custom CSS |
| UI Components | Emotion/styled-components |
| Charts | Chart.js 4.4.9 + react-chartjs-2 | **TO REMOVE** |
| Maps | Mapbox GL (v2.0.0 & v3.5.2 - dual versions!) | |
| Calendar | react-calendar 5.0.0 | |
| CSV Parsing | PapaParse 5.4.1 | |
| Backend | Supabase (PostgreSQL) | **TO REMOVE** |
| Hosting | Vercel | |

---

## Data Architecture

### artworks.json
- **Location:** `/frontend/src/data/artworks.json`
- **Size:** 3.4 MB, 5,295 lines
- **Records:** 250 artworks

**Schema:**
```typescript
interface Artwork {
  id: number;
  name: string;
  artist_culture: string;
  date: string;              // BCE/CE format: "-15000/-13000"
  location: string;          // Creation location
  materials: string;
  unit: number;              // 1-10 (content area)
  museum: string;
  displayedLocation: string;
  displayedLongitude: number;
  displayedLatitude: number;
  originatedLongitude: number;
  originatedLatitude: number;
  image: string[];           // Filenames
  videoLink: string[] | null;
  transcript: object[] | null;
  language?: string;
}
```

### Images
- **Location:** `/frontend/src/artImages/`
- **Count:** 407 WebP files
- **Size:** ~54 MB total
- **Naming:** `[ID]_[artwork-name].webp`

### DueDates.json
- **Location:** `/frontend/src/pages/Calendar/DueDates.json`
- **Purpose:** Maps artwork IDs to AP course due dates

---

## Site Structure

### Routes

| Path | Component | Status |
|------|-----------|--------|
| `/` | Home | Keep |
| `/artgallery` | Catalog | Keep |
| `/exhibit?id={id}` | Exhibit | Keep |
| `/flashcards` | Flashcards | Keep |
| `/map` | Map | Keep |
| `/calendar` | Calendar | Keep |
| `/tutorial` | Tutorial | Keep |
| `/about` | About | Keep |
| `/admin` | AdminDashboard | **REMOVE** |
| `/admin/debug` | DebugPage | **REMOVE** |
| `/admin/supabase-debug` | SupabaseDebug | **REMOVE** |

### Component Directory

```
/frontend/src/
├── components/
│   ├── NavBar.js
│   ├── AdminLogin.js         ❌ REMOVE
│   ├── AnalyticsCharts.js    ❌ REMOVE
│   ├── FilterControls.js
│   ├── SessionsTable.js      ❌ REMOVE
│   └── UserStats.js          ❌ REMOVE
│
├── pages/
│   ├── Home/
│   ├── ArtGallery/
│   │   ├── ArtCard.js
│   │   ├── Catalog.js      (326 lines)
│   │   └── ControlBar/
│   ├── Exhibit/
│   │   ├── Exhibit.js
│   │   ├── VideoPlayer.js  (224 lines)
│   │   ├── PhotoGallery.js (370 lines)
│   │   ├── MiniMap.js
│   │   └── Identifiers.js
│   ├── Flashcards/
│   │   └── Flashcards.js   (929 lines) ⚠️ REFACTOR
│   ├── Map/
│   │   └── MapBox.js       (344 lines)
│   ├── Calendar/
│   ├── Tutorial/
│   ├── About/
│   ├── Admin/                ❌ REMOVE entire directory
│   │   ├── AdminDashboard.js
│   │   └── DebugPage.js
│   └── SupabaseDebug.js      ❌ REMOVE
│
├── utils/
│   ├── supabaseClient.js     ❌ REMOVE
│   ├── analyticsService.js   ❌ REMOVE
│   ├── authService.js        ❌ REMOVE
│   └── timeTracker.js        ❌ REMOVE (37 KB)
│
└── data/
    └── artworks.json
```

---

## Styling Situation

### Current Approaches (3)

1. **Tailwind CSS** - Primary, used in most new code
2. **W3.CSS** - Legacy, `/src/w3.css` still imported
3. **Custom CSS** - `App.css` + component-specific files

### CSS Variables (in App.css)
```css
--background-color: #210b2c   /* dark purple */
--accent-color: #55286f       /* medium purple */
--foreground-color: #bc96e6   /* light purple */
--text-color: #d8b4e2         /* lavender */
--button-color: #ae759f       /* muted purple */
--button-text-color: #55286f  /* dark purple */
```

### Issues
- Mixed approaches create inconsistency
- W3.CSS adds unused CSS weight
- Some inline styles scattered in components
- Emotion used minimally (just Home page background)

---

## Large Files Needing Refactor

| File | Lines | Action |
|------|-------|--------|
| `Flashcards.js` | 929 | Refactor: split into smaller components |
| `SupabaseDebug.js` | 785 | **DELETE** (analytics removal) |
| `AdminDashboard.js` | 576 | **DELETE** (analytics removal) |
| `DebugPage.js` | 313 | **DELETE** (analytics removal) |
| `PhotoGallery.js` | 370 | Refactor: extract hooks |
| `MapBox.js` | 344 | Refactor: separate logic from UI |
| `Catalog.js` | 326 | Refactor: extract filter/sort hooks |

---

## Hardcoded Data

### Korus Array
Hardcoded 250-item teaching order array appears in:
- `Flashcards.js`
- `Exhibit.js` (for prev/next navigation)

Should be centralized to single source.

### Content Areas
```javascript
const contentAreas = {
  1: "Global Prehistory",
  2: "Ancient Mediterranean",
  3: "Early Europe and Colonial Americas",
  4: "Later Europe and Americas",
  5: "Indigenous Americas",
  6: "Africa",
  7: "West and Central Asia",
  8: "South, East, and Southeast Asia",
  9: "The Pacific",
  10: "Global Contemporary"
};
```

Defined in multiple places.

---

## Supabase Usage (TO BE REMOVED)

> **Decision:** Removing all analytics for simplification. Supabase will be completely removed.

### Current Tables
- `user_sessions` - Analytics tracking
  - id (UUID)
  - user_id (TEXT)
  - session_time_sec (INTEGER)
  - page_path (TEXT)
  - created_at (TIMESTAMP)

### Files to Delete
- `utils/supabaseClient.js`
- `utils/analyticsService.js`
- `utils/authService.js`
- `utils/timeTracker.js` (37 KB)
- `pages/Admin/` (entire directory)
- `pages/SupabaseDebug.js`
- `components/AdminLogin.js`
- `components/AnalyticsCharts.js`
- `components/SessionsTable.js`
- `components/UserStats.js`

---

## Build & Deploy

### Scripts
```json
{
  "start": "react-app-rewired start",
  "build": "CI=false react-app-rewired build"
}
```

### Vercel Config
- Static build from `/frontend/build`
- All routes fallback to `index.html` (SPA)
- Environment variables in Vercel dashboard

### Environment Variables
- `REACT_APP_SUPABASE_URL` - **TO REMOVE**
- `REACT_APP_SUPABASE_ANON_KEY` - **TO REMOVE**
- `REACT_APP_MAPBOX_TOKEN`

---

## Known Issues

1. **Dual Mapbox versions** - Both v2.0.0 and v3.5.2 in dependencies
2. **Debug code in production** - Extensive console logging
3. **No TypeScript** - Refactoring is riskier
4. **Large JSON bundle** - 3.4MB loaded on every page
5. **Mixed styling** - Inconsistent look and feel
6. **No error boundaries** - App can crash on errors

---

## Dependencies (28 production)

### Core
- react, react-dom, react-router-dom
- react-scripts, react-app-rewired

### UI
- tailwindcss, @emotion/styled
- react-calendar
- chart.js, react-chartjs-2 - **TO REMOVE**
- mapbox-gl (2 versions! - consolidate to one)

### Data/Backend
- @supabase/supabase-js - **TO REMOVE**
- papaparse, uuid

### Utilities
- dotenv, js-cookie, ua-parser-js
- buffer, stream-browserify, process, util (polyfills)

---

*Last updated: 2026-01-24*
