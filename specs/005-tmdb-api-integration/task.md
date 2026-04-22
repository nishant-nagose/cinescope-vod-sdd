# Tasks: TMDB API Integration

**Branch**: `005-tmdb-api-integration` | **Spec**: [./spec.md](./spec.md) | **Plan**: [./plan.md](./plan.md)
**Input**: Design documents from `/specs/005-tmdb-api-integration/`
**Prerequisites**: spec.md (required), plan.md (required), checklists/requirements.md (passed)
**Status**: COMPLETED (2026-04-21)

## Format: `[ID] [P?] [USn] Description`

- **[P]**: Can run in parallel (different files, no shared dependencies)
- **[USn]**: User story this task belongs to (US1, US2...)
- Include exact file paths in task descriptions

---

## Phase 1: Setup & Infrastructure

- [x] T5 [US1] Configure environment variables — `VITE_TMDB_API_KEY`, `VITE_API_BASE_URL`, `VITE_IMAGE_BASE_URL` in `.env` and validate on startup
  - [x] Load VITE_TMDB_API_KEY from environment
  - [x] Load VITE_API_BASE_URL
  - [x] Load VITE_IMAGE_BASE_URL
  - [x] Validate configuration on startup

---

## Phase 2: Foundational (Shared Prerequisites)

- [x] T3 [P] [US1] Implement caching layer — cache list endpoints with 5-minute TTL, cache key generation, cache invalidation logic
  - [x] Implement caching for list endpoints
  - [x] 5-minute TTL for cache
  - [x] Cache key generation
  - [x] Cache invalidation logic

- [x] T4 [P] [US1] Implement error handling infrastructure — standard error response format, network error handling, API error parsing, user-friendly error messages
  - [x] Standard error response format
  - [x] Network error handling
  - [x] API error parsing
  - [x] User-friendly error messages

---

## Phase 3: API Service Layer (US1) — Priority: P0 🎯 MVP

- [x] T1 [US1] Create `src/services/tmdbApi.ts` — configure API base URL, implement API key loading from environment, create fetch wrapper with error handling
  - [x] Create `src/services/tmdbApi.ts`
  - [x] Configure API base URL
  - [x] Implement API key loading from environment
  - [x] Create fetch wrapper with error handling

- [x] T2 [US1] Implement all API endpoints — trending, top-rated, search, movie details, cast/credits
  - [x] Trending movies endpoint
  - [x] Top-rated movies endpoint
  - [x] Search movies endpoint
  - [x] Movie details endpoint
  - [x] Cast/credits endpoint

- [x] T6 [P] [US1] Create image URL helper functions in `src/services/tmdbApi.ts` — `getImageUrl()`, support different image sizes, handle missing images
  - [x] Create `getImageUrl()` function
  - [x] Support different image sizes
  - [x] Handle missing images

---

## Phase 4: Polish

- [x] T7 [US1] Create `tests/services/tmdbApi.test.ts` — test all endpoint calls, test error handling
  - [x] Create `tests/services/tmdbApi.test.ts`
  - [x] Test endpoint calls
  - [x] Test error handling

---

## Quality Checklist

### Code Quality
- [x] TypeScript types on all responses
- [x] Proper error types
- [x] No hardcoded values
- [x] Consistent naming
- [x] Comments on complex logic

### Functionality
- [x] All endpoints working
- [x] Caching functioning correctly
- [x] Error handling robust
- [x] Configuration loaded properly

### Deployment (GitHub Pages)
- [x] API key securely managed
- [x] HTTPS requests to TMDB
- [x] CORS requests handled
- [x] Rate limiting managed

## Acceptance Criteria Status

| Criterion | Status | Notes |
|-----------|--------|-------|
| Trending endpoint works | ✅ | Returns movie list |
| Top-rated endpoint works | ✅ | Supports pagination |
| Search endpoint works | ✅ | Filters by query |
| Details endpoint works | ✅ | Returns single movie |
| Cast endpoint works | ✅ | Returns cast list |
| Caching enabled | ✅ | 5-min TTL |
| Error handling | ✅ | User-friendly messages |
| Environment config | ✅ | Via GitHub Secrets |

## Checkpoint
✅ API integration layer complete and tested. All features can consume TMDB data.

## Notes
- TMDB API is fast and reliable
- Free tier provides sufficient data
- Rate limiting not an issue for demo app
- Image CDN handled by TMDB

---

## Dependencies & Execution Order

### Phase Dependencies
- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 — blocks all user story work
- **User Stories (Phase 3+)**: All depend on Phase 2 completion
- **Polish (Final Phase)**: Depends on all user story phases complete

### Parallel Opportunities
- T3 (Caching Layer) and T4 (Error Handling) in Phase 2 can run in parallel (different concerns)
- T6 (Image URL helpers) in Phase 3 can run in parallel with T2 (different file sections, no shared dependency)

---

## Implementation Strategy

### MVP First
1. Complete Phase 1: Setup (T5)
2. Complete Phase 2: Foundational (T3, T4)
3. Complete Phase 3: API Service Layer (T1, T2) 🎯
4. STOP and VALIDATE independently

### Incremental Delivery
- After Phase 3 (US1): Deploy and validate → MVP
- Polish phase last

---

## Notes
- [P] = different files, no shared dependencies — safe to parallelise
- [USn] label maps task to user story for traceability
- Commit after each phase checkpoint
- All sub-tasks within a parent task run sequentially unless marked [P]
