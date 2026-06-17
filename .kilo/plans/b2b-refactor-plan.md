# Landing Page Refactor Plan

Current findings (build is passing: `dist/index.html ... ✓ built in 1.69s`). Two stale placeholders remain:
- `hero.jsx` line 18: `GET YOURS NOW`
- `DataPrivacy.jsx` line 77: `info@edgepoint.com` and `63 0000000000`

Navbar/footer placeholders were already updated in a previous session.

## Changes to make

### 1. `src/components/hero.jsx` — B2B authority, CTA unification
- `.hero_eyebrow`: `"THE ALL-IN-ONE SYSTEM FOR PHILIPPINE COOPERATIVES"`
- `.hero_title`: `"Modernize Your Cooperative. Simplify Compliance."`
- `.hero_description`: keep existing copy (unchanged)
- `.hero_buttons`:
  - Remove `Register` button
  - Primary: `Book a Free Demo` → opens BookingModal (`onClick={() => setIsModalOpen(true)}`)
  - Secondary: `Explore Features` → anchor to `#features` / `#services`
- Ensure existing `.hero_stats` and `.hero_carousel` immediately follow the buttons (they already do in markup; verify CSS doesn’t push them too far below the fold)

### 2. `src/components/purpose.jsx` — Edgepoint authority line
- Add beneath the existing `purpose_text`: `Engineered by Edgepoint for secure, scalable cooperative management.`
- Style as a secondary paragraph using existing `.purpose_text` class or a new `.purpose_authority` class.

### 3. `src/App.jsx` — Move social proof earlier in the page
- Move `<Partners />` to appear **directly after `<Purpose />`** (before `<ServingCooperatives />`).
- Rationale: page becomes Hero → Challenges → Purpose → Partners → ServingCooperatives → Services → CooperativeChoice → Footer. This moves the client roster from near-bottom to mid-page, increasing visibility.

### 4. `src/components/DataPrivacy.jsx` — Remove placeholder contact info
- Replace `info@edgepoint.com` with `edgepoint.solutions.inc@gmail.com`
- Replace `63 0000000000` with `0962 807 3120`

### 5. `src/styles/hero.css` / `navbar.css` and any other layout fixes
- Verify the hero buttons anchor link for `Explore Features` matches the correct section id (currently `#services` is used in navbar; confirm section exists or use consistent id).
- Verify no `0000000000` strings remain anywhere else in codebase.

## Verification
- Run `npm run lint` and `npm run build` after changes.
- Confirm no placeholder text remains via grep.
