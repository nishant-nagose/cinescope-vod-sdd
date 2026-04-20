# Feature Specification: Search by Title

**Feature Branch**: `003-search-by-title`
**Created**: 2026-04-20
**Status**: Draft
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

---

## Functional Requirements

- Show a search bar visible in the header on all pages.
- Debounce search input by 300ms before requesting suggestions.
- Display up to 10 suggestion items while typing.
- Persist the search term in the URL query string.
- Support sorting results by relevance, rating, or release date.
- Do not send a search request for queries shorter than 3 characters.

## Success Criteria

- Search suggestions appear for valid queries of 3 or more characters.
- Search results page loads with the query reflected in the URL.
- Users can sort results by relevance, rating, or newest releases.
- No API request is made for empty or too-short queries.
- Matching text is highlighted in suggestion results.

## Assumptions

- Search results are most useful after at least 3 characters.
- Users expect URL persistence for sharable search links.
- Sorting by relevance is the default experience.

## Edge Cases

- If no matching movies are found, display "No movies found for '<query>'".
- If the query contains special characters, URL-encode it safely.
- If the API fails, show a friendly retry message.
