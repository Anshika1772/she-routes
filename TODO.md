# TODO: Enhance Selected Route with Nearby Safety Services

## Steps to Complete

- [x] Create TODO.md with plan
- [x] Update `app/route-planner/page.tsx`:
  - Add state for `safetyServices` array.
  - Add `fetchSafetyServices` function to query Overpass API for each type, find nearest, calculate distance.
  - Use `useEffect` to fetch when `selectedRoute` changes.
  - Add new Card "Nearest Safety Services" below "Available Routes" with 3 rows.

- [x] Update `components/FreeMap.tsx`:
  - Add `safetyServices` prop.
  - Render custom markers for each service type with colors: blue (police), red (hospital), purple (NGO).

- [x] Run `npm run dev` to verify the app builds and runs without errors.
- [x] Test the feature by selecting a route and checking markers and UI.
