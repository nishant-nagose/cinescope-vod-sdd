# Feature Specification: Search by Title

**Feature Branch**: `003-search-by-title`
**Created**: 2026-04-20
**Status**: COMPLETED
**Input**: User description: "Search by Title feature for CineScope"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Find Specific Movies (Priority: P1)
As a user looking for a specific movie, I want to search by movie title so that I can quickly find what I want.

**Why this priority**: Search is a core discovery tool that helps users find titles they already have in mind.

**Independent Test**: Enter a search term and verify that matching results are shown with the search query reflected in the URL.

**Acceptance Scenarios**:
1. **Given** the user types into the search bar, **When** the query reaches 3 characters, **Then** search suggestions appear.
2. **Given** the user submits the search, **When** the results page loads, **Then** matching movies are displayed with pagination.
3. **Given** no query is entered, **When** the user presses search, **Then** no API call is made and the user remains on the current page.
4. **Given** the query is short, **When** length < 3, **Then** the interface prompts the user to type more characters.

### User Story 2 - Sort and Filter Results (Priority: P2)
As a user reviewing search results, I want to sort results by different criteria so that I can find the most relevant movie for my needs.

**Why this priority**: Sorting improves discoverability but is secondary to the core search flow.

**Independent Test**: Perform a search with multiple results and verify that switching sort options reorders the displayed list.

**Acceptance Scenarios**:
1. **Given** search results are displayed, **When** the user selects "Sort by Rating", **Then** results are reordered with highest-rated movies first.
2. **Given** search results are displayed, **When** the user selects "Sort by Release Date", **Then** results are reordered with newest movies first.
3. **Given** search results are displayed, **When** the user selects "Sort by Relevance", **Then** results revert to the default API ordering.

### Edge Cases
- If no matching movies are found, display "No movies found for '<query>'".
- If the query contains special characters, URL-encode it safely.
- If the API fails, show a friendly retry message.

---

## Requirements *(mandatory)*

### Functional Requirements
- **FR-001**: The feature MUST show a search bar visible in the header on all pages.
- **FR-002**: The feature MUST debounce search input by 300ms before requesting suggestions.
- **FR-003**: The feature MUST display up to 10 suggestion items while typing.
- **FR-004**: The feature MUST persist the search term in the URL query string.
- **FR-005**: The feature MUST support sorting results by relevance, rating, or release date.
- **FR-006**: The feature MUST NOT send a search request for queries shorter than 3 characters.

### Key Entities
- **SearchQuery**: Query string (min 3 chars), debounce 300ms
- **SearchResult**: Movie list + pagination metadata

## Success Criteria *(mandatory)*

### Measurable Outcomes
- **SC-001**: Search suggestions appear for valid queries of 3 or more characters.
- **SC-002**: Search results page loads with the query reflected in the URL.
- **SC-003**: Users can sort results by relevance, rating, or newest releases.
- **SC-004**: No API request is made for empty or too-short queries.
- **SC-005**: Matching text is highlighted in suggestion results.

## Assumptions

- Search results are most useful after at least 3 characters.
- Users expect URL persistence for sharable search links.
- Sorting by relevance is the default experience.
