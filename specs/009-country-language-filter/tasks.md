# Tasks: Country & Language Content Filter

**Input**: Design documents from `specs/009-country-language-filter/`
**Prerequisites**: plan.md ✅, spec.md ✅, data-model.md ✅
**Branch**: `018-country-language-options`

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1–US5)
- All tasks include exact file paths

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish new types that every subsequent task depends on.

- [X] T001 Add TmdbCountry, TmdbLanguage, and ContentFilterParams interfaces to src/types/tmdb.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core filter context + tmdbApi migration — MUST be complete before any user story work.

**⚠️ CRITICAL**: No user story hook or UI work can begin until this phase is complete.

- [X] T002 Create src/context/ContentFilterContext.tsx — ContentFilterContextValue interface, ContentFilterProvider component with useState for countries (default ['US']) and languages (default ['en']), computed filterKey string (`${countries.join(',')}-${languages.join(',')}`), and useContentFilter custom hook
- [X] T003 Wrap root app in <ContentFilterProvider> in src/App.tsx (depends on T002)
- [X] T004 Comprehensive update to src/services/tmdbApi.ts: (a) add internal buildFilterParams helper that maps ContentFilterParams to TMDB query object (with_origin_country=pipe-joined codes, with_original_language=pipe-joined codes, omits param when array is empty); (b) add getCountries() → GET /configuration/countries → TmdbCountry[]; (c) add getLanguages() → GET /configuration/languages → TmdbLanguage[]; (d) migrate getTrendingMovies to GET /discover/movie?sort_by=popularity.desc with optional filter?: ContentFilterParams; (e) migrate getTopRatedMovies to GET /discover/movie?sort_by=vote_average.desc&vote_count.gte=200 with optional filter?: ContentFilterParams; (f) add optional filter?: ContentFilterParams to getMoviesByGenre, getNewReleases, getCriticallyAcclaimed (depends on T001)

**Checkpoint**: Foundation ready — hook and UI implementation can now begin.

---

## Phase 3: User Story 1 - Default Region & Language (Priority: P1) 🎯 MVP

**Goal**: App loads showing US + English filtered content by default across all carousels. No user interaction required — the ContentFilterContext supplies the default filter and all hooks pass it to the API automatically.

**Independent Test**: Open the app. Open browser DevTools Network tab. Confirm /discover/movie requests include `with_origin_country=US` and `with_original_language=en`. Confirm all carousels render US/English content.

- [X] T005 [P] [US1] Update src/hooks/useTrendingMovies.ts — call useContentFilter(), destructure { countries, languages, filterKey }, pass { countries, languages } as filter arg to getTrendingMovies(), change cacheKey to `trending-${filterKey}` (depends on T002, T004)
- [X] T006 [P] [US1] Update src/hooks/useTopRatedMovies.ts — call useContentFilter(), pass { countries, languages } as filter to getTopRatedMovies(), change cacheKey to `top-rated-${page}-${filterKey}`, add useEffect([filterKey], () => setCurrentPage(1)) to reset pagination on filter change (depends on T002, T004)
- [X] T007 [P] [US1] Update src/hooks/useMoviesByGenre.ts — call useContentFilter(), pass { countries, languages } as filter to getMoviesByGenre(), change cacheKey to `movies-genre-${genreId}-${filterKey}` (depends on T002, T004)
- [X] T008 [P] [US1] Update src/hooks/useNewReleases.ts — call useContentFilter(), pass { countries, languages } as filter to getNewReleases(), change cacheKey to `new-releases-${filterKey}` (depends on T002, T004)
- [X] T009 [P] [US1] Update src/hooks/useCriticallyAcclaimed.ts — call useContentFilter(), pass { countries, languages } as filter to getCriticallyAcclaimed(), change cacheKey to `critically-acclaimed-${filterKey}` (depends on T002, T004)
- [X] T010 [P] [US1] Create src/hooks/useCountries.ts — useApi<TmdbCountry[]> wrapper calling getCountries() with cacheKey 'tmdb-countries'; returns { data: TmdbCountry[], loading, error } (depends on T001, T004)
- [X] T011 [P] [US1] Create src/hooks/useLanguages.ts — useApi<TmdbLanguage[]> wrapper calling getLanguages() with cacheKey 'tmdb-languages'; returns { data: TmdbLanguage[], loading, error } (depends on T001, T004)
- [X] T012 [P] [US1] Write tests/context/ContentFilterContext.test.tsx — test default state has countries=['US'] and languages=['en']; test setCountries(['KR']) updates state; test setLanguages(['ko']) updates state; test filterKey is 'US-en' by default; test filterKey recomputes when state changes; test ContentFilterProvider renders children; test useContentFilter throws if used outside provider (depends on T002)

**Checkpoint**: US1 complete — default US+English filtering is live for all carousels.

---

## Phase 4: User Story 2 + User Story 3 - Country & Language Dropdowns (Priority: P2)

**Goal**: Two interactive multi-select dropdowns appear in the persistent header. Country dropdown (globe icon) and Language dropdown (translate icon). Each shows a count badge. Selecting items updates the global context and all carousels refresh.

**Independent Test**: Click Country dropdown → uncheck United States → check South Korea → close dropdown. Confirm badge shows "1 Country" and carousels update. Click Language dropdown → check French → badge shows "2 Languages" (if English still selected). Confirm carousels show French-language content.

- [X] T013 [US2] Create src/components/ContentFilterBar.tsx — component shell: no external props; calls useContentFilter(), useCountries(), useLanguages(); maintains two boolean state vars (countryOpen, languageOpen); attaches mousedown listener via useRef + useEffect for click-outside detection that closes whichever panel is open (depends on T002, T010, T011)
- [X] T014 [US2] Implement country dropdown in src/components/ContentFilterBar.tsx — globe icon (SVG or emoji) + trigger button showing count badge ("All Countries" when countries.length===0, "N Countries" when N>0); scrollable dropdown panel (max-h-64 overflow-y-auto); first item is "Select All" checkbox (checked when countries.length===0); each TmdbCountry rendered as labeled checkbox; clicking "Select All" calls setCountries([]); clicking an individual country: if currently Select All active sets countries to [code], else toggles code in/out of array (depends on T013)
- [X] T015 [US3] Implement language dropdown in src/components/ContentFilterBar.tsx — translate icon + trigger button showing count badge ("All Languages" when languages.length===0, "N Languages" when N>0); same panel structure as country: "Select All" first, then each TmdbLanguage as labeled checkbox; same Select All toggle logic; clicking individual language toggles it in the languages array (depends on T013)
- [X] T016 [US2] Add <ContentFilterBar /> to src/components/Layout.tsx — insert as a second row within the existing header element, directly below the main nav row; apply responsive horizontal padding px-3 sm:px-4 md:px-6 lg:px-8 to match the nav row (depends on T013)
- [X] T017 [US3] Apply language filter client-side to search results in src/pages/SearchPage.tsx — import useContentFilter; after search results load, if languages.length > 0 filter the movies array to only include movies where movie.original_language is in the selected languages array; country filter is not applied to search results (TMDB /search/movie limitation, documented in plan) (depends on T002)
- [X] T018 [P] [US2] Write tests/components/ContentFilterBar.test.tsx — mock useContentFilter (returns default state + jest.fn() setters), useCountries (returns sample country list), useLanguages (returns sample language list); test: component renders without error; country trigger button opens panel on click; checkbox click calls setCountries with updated array; clicking "Select All" calls setCountries([]); individual click when Select All active calls setCountries([code]); count badge shows correct label; language dropdown same coverage; click-outside closes panel (depends on T013, T014, T015)
- [X] T019 [P] [US2] Update tests/pages/HomePage.test.tsx — add vi.mock for useContentFilter returning { countries: ['US'], languages: ['en'], filterKey: 'US-en', setCountries: vi.fn(), setLanguages: vi.fn() }; verify existing carousel assertions still pass with mocked filter context (depends on T002)

**Checkpoint**: US2 + US3 complete — both dropdowns visible in header, filter changes update all carousels immediately.

---

## Phase 5: User Story 4 + User Story 5 - Combined Filters & Empty States (Priority: P3)

**Goal**: Combined country+language filtering works correctly via AND logic. Empty-state message shown when a filter combination yields zero results. "Select All" reliably resets its filter dimension.

**Independent Test**: Select "France" in Country dropdown and "fr" in Language dropdown → content narrows to French-produced French-language films. Select an obscure country+language pair → empty state message "No movies found for the selected filters." appears in each carousel without layout breaks. Click "Select All" in Country dropdown → country filter lifts, all countries shown while language remains.

- [X] T020 [US4] Add optional emptyMessage?: string prop to src/components/MovieCarousel.tsx — when movies.length===0 and not loading and not error, display the provided emptyMessage instead of the hardcoded "No movies available for this section." (keep existing text as default)
- [X] T021 [US4] Pass emptyMessage="No movies found for the selected filters." to all <MovieCarousel> usages in src/pages/HomePage.tsx, src/pages/TrendingPage.tsx, and src/pages/TopRatedPage.tsx (depends on T020)
- [X] T022 [P] [US5] Update tests/TrendingPage.test.tsx — add vi.mock for useContentFilter returning default filter state { countries: ['US'], languages: ['en'], filterKey: 'US-en', setCountries: vi.fn(), setLanguages: vi.fn() }; verify page renders correctly with mocked filter context
- [X] T023 [P] [US5] Update tests/TopRatedPage.test.tsx — same vi.mock pattern for useContentFilter; verify pagination and carousel behavior unaffected by filter mock

**Checkpoint**: All user stories complete — combined filtering, empty states, and Select All reset all work end-to-end.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: API test coverage for migrated endpoints and new service functions.

- [X] T024 [P] Update tests/services/tmdbApi.test.ts — add tests for: getCountries() calls /configuration/countries; getLanguages() calls /configuration/languages; getTrendingMovies() now calls /discover/movie with sort_by=popularity.desc; getTopRatedMovies() now calls /discover/movie with sort_by=vote_average.desc; buildFilterParams generates correct with_origin_country and with_original_language params; empty array omits the parameter entirely; multiple codes join with pipe separator

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: T002 and T003 depend on T001; T004 depends on T001; T003 depends on T002
- **Phase 3 (US1)**: All tasks depend on T002 + T004; T005–T011 can run in parallel once T002+T004 complete; T012 can run in parallel with T005–T011
- **Phase 4 (US2+US3)**: T013 depends on T002+T010+T011; T014+T015 depend on T013; T016 depends on T013; T017 depends on T002; T018+T019 can run in parallel once T013–T015 complete
- **Phase 5 (US4+US5)**: T020 is standalone; T021 depends on T020; T022+T023 can run in parallel
- **Phase 6 (Polish)**: T024 depends on T004

### User Story Dependencies

- **US1 (P1)**: Depends only on Foundational phase — no other user story dependency
- **US2 (P2)**: Depends on US1 hooks being in place (useCountries, useLanguages in T010, T011)
- **US3 (P2)**: Shares Phase 4 with US2; language dropdown implemented in same component; search language filter is independent
- **US4 (P3)**: Depends on Phase 3+4 completion; empty state changes are additive
- **US5 (P3)**: Select All logic is part of Phase 4 ContentFilterBar implementation; this phase adds tests

### Within Each Phase

- Types before context before app root
- Service functions before hooks that call them
- Component shell before dropdown sections
- Component before Layout integration
- Implementation before tests (tests mock the implementation)

### Parallel Opportunities

```bash
# Phase 3 — all five hook updates + useCountries + useLanguages + context test can run together:
T005 useTrendingMovies.ts
T006 useTopRatedMovies.ts
T007 useMoviesByGenre.ts
T008 useNewReleases.ts
T009 useCriticallyAcclaimed.ts
T010 useCountries.ts (new file)
T011 useLanguages.ts (new file)
T012 ContentFilterContext.test.tsx (new file)

# Phase 4 — after T013 (shell) is done, T014+T015 modify same file (sequential); tests are independent:
T018 ContentFilterBar.test.tsx (after T013–T015)
T019 HomePage.test.tsx (independent)

# Phase 5 — TrendingPage and TopRatedPage test updates are parallel:
T022 TrendingPage.test.tsx
T023 TopRatedPage.test.tsx
```

---

## Implementation Strategy

### MVP First (US1 Only)

1. Complete Phase 1: Add types (T001)
2. Complete Phase 2: Context + App.tsx + tmdbApi (T002–T004)
3. Complete Phase 3: Five hook updates + new hooks (T005–T012)
4. **STOP and VALIDATE**: Confirm all carousels fetch /discover/movie with US+en params
5. Deploy/demo — users already see US+English filtered content

### Incremental Delivery

1. Phase 1+2 → Foundation ready
2. Phase 3 → US1 done → carousels filter by default (MVP)
3. Phase 4 → US2+US3 done → users can change filters via dropdowns
4. Phase 5 → US4+US5 done → edge cases handled, empty states work
5. Phase 6 → polish → full test coverage

---

## Notes

- [P] tasks affect different files — safe to run in parallel
- T005–T009 all modify different hook files — truly parallel
- T014 and T015 both modify ContentFilterBar.tsx — run sequentially in order
- The filterKey cache-busting strategy means no explicit cache invalidation is needed — a different filterKey string is simply a different cache key, causing a cache miss and new fetch
- Search page country filter is intentionally not implemented (TMDB limitation documented in plan Known Limitations)
- useTopRatedMovies page reset (T006) is critical: without it, a filter change on page 3 would fetch page 3 content for the new filter, which may not exist
