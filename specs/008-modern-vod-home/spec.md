# Feature Specification: Modern VOD Home Page

**Feature Branch**: `008-modern-vod-home`
**Created**: 2026-04-22
**Status**: APPROVED
**Input**: User description: "Modern VOD home page with horizontal scrolling carousels, category filtering, and premium UI"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Discover Content on Modern Home Page (Priority: P1)
As a new user landing on CineScope, I want to see a modern VOD home page with curated content sections so that I can discover movies intuitively.

**Why this priority**: Home page is the primary entry point and sets the premium brand experience.

**Independent Test**: Load the home page and verify all carousel sections render with horizontal scrolling and category filtering works.

**Acceptance Scenarios**:
1. **Given** the app launches, **When** home page loads, **Then** the page displays all carousel sections (Top & Latest, Top 10 Today, By Category, New on CineScope, Critically Acclaimed).
2. **Given** a carousel is visible, **When** the user swipes/scrolls horizontally, **Then** 2-row carousel reveals adjacent movie cards smoothly.
3. **Given** the user opens the category dropdown, **When** they select a genre (Romantic, Thriller, Action), **Then** the category carousel updates with filtered movies.
4. **Given** the user clicks a movie card, **When** activated, **Then** navigation to Movie Detail page succeeds.
5. **Given** data is loading, **When** carousels fetch content, **Then** skeleton loaders display in carousel rows.

### User Story 2 - Category Filtering (Priority: P2)
As a user browsing by mood, I want to filter movies by genre categories so that I can discover content matching my interests.

**Why this priority**: Genre filtering improves discovery experience and user retention.

**Acceptance Scenarios**:
1. **Given** the category dropdown displays available genres, **When** the user selects a genre, **Then** the category carousel populates with movies of that genre.
2. **Given** a genre is selected, **When** the user scrolls the carousel, **Then** relevant movies appear with at least 20 movies loaded (2 rows).
3. **Given** a user switches genres, **When** the dropdown changes, **Then** the carousel smoothly transitions to new genre content.

### Edge Cases
- If a carousel has no data, display "No movies available for this category."
- If horizontal scrolling is not supported (old browsers), provide arrow buttons for navigation.
- If images fail to load, show placeholder graphics with visible titles.
- If category data is unavailable, hide the category filter section temporarily.

---

## Requirements *(mandatory)*

### Functional Requirements
- **FR-001**: The home page MUST display five carousel sections:
  1. Top & Latest Movies (horizontal scroll, 2 rows, 20 movies)
  2. Top 10 Movies Today (horizontal scroll, 2 rows, 20 movies)
  3. Movies by Category (with dropdown genre selector, horizontal scroll, 2 rows, 20 movies)
  4. New on CineScope (horizontal scroll, 2 rows, 20 movies - latest releases)
  5. Critically Acclaimed Movies (horizontal scroll, 2 rows, 20 movies - highest rated)
- **FR-002**: Each carousel MUST support smooth horizontal scrolling/swiping on mobile and desktop.
- **FR-003**: Each carousel MUST show 2 visible rows of movie cards with responsive sizing.
- **FR-004**: The category selector MUST provide dropdown of available genres (Romantic, Thriller, Action, Comedy, Drama, etc.).
- **FR-005**: Movie cards in carousels MUST show: poster image, title, rating badge.
- **FR-006**: Clicking any movie card MUST navigate to `/movie/:id` detail page.
- **FR-007**: Carousels MUST handle loading, error, and empty states with appropriate messaging.
- **FR-008**: The page MUST be fully responsive with horizontal scroll adjusted for mobile (1.5-2 cards visible).
- **FR-009**: Skeleton loaders MUST display while carousel data loads.
- **FR-010**: The page MUST include navigation links to dedicated Trending, Top Rated, and Search pages.

### Key Entities
- **Carousel**: Collection of movies in horizontal scroll layout (2 rows, 20 movies per load)
- **Movie**: ID, title, poster image, rating badge
- **Genre**: ID, name (Romantic, Thriller, Action, Comedy, Drama, Horror, Sci-Fi, etc.)
- **Section**: Carousel with theme (Latest, Top10, Category, New, Acclaimed)

## Success Criteria *(mandatory)*

### Measurable Outcomes
- **SC-001**: Home page loads and displays all five carousel sections within 2 seconds.
- **SC-002**: Each carousel renders with at least one row fully visible on mobile (1.5-2 cards), 2 rows on tablet, 2 rows on desktop.
- **SC-003**: Horizontal scroll is smooth and responsive to touch/mouse gestures.
- **SC-004**: Category dropdown displays 10+ genre options and updates carousel on selection.
- **SC-005**: Movie cards are clickable and navigate to detail page successfully.
- **SC-006**: Carousel sections adapt responsively to all screen sizes (mobile, tablet, desktop).
- **SC-007**: Loading states (skeletons) display while data fetches for each carousel.
- **SC-008**: Error messages appear if carousel data fails to load, with retry option.
- **SC-009**: Page is accessible at route `/` (home).
- **SC-010**: All carousels use consistent styling and spacing with premium aesthetic.

## Assumptions

- TMDB API provides genre filtering via `discover/movie?with_genres=<id>` endpoint.
- Movie images (posters) are available from TMDB CDN.
- Initial load shows 20 movies per carousel section (2 rows × 10 cards per row).
- Horizontal scrolling is the primary interaction for carousel discovery.
- Category filtering stores selection in React state (session-only, no persistence).
