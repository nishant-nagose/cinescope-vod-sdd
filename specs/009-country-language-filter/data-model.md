# Data Model: Country & Language Content Filter

**Feature**: 009-country-language-filter  
**Created**: 2026-04-23

## New Types

### `TmdbCountry`
Source: `GET /configuration/countries` (flat array response)

| Field | Type | Example | Notes |
|-------|------|---------|-------|
| `iso_3166_1` | `string` | `"US"`, `"FR"` | ISO 3166-1 alpha-2; used as filter value |
| `english_name` | `string` | `"United States"` | Display label in dropdown |
| `native_name` | `string` | `"United States"` | Fallback display; may differ from english_name |

### `TmdbLanguage`
Source: `GET /configuration/languages` (flat array response)

| Field | Type | Example | Notes |
|-------|------|---------|-------|
| `iso_639_1` | `string` | `"en"`, `"fr"` | ISO 639-1 code; used as filter value |
| `english_name` | `string` | `"English"`, `"French"` | Primary display label |
| `name` | `string` | `"English"`, `"Français"` | Native script name; secondary display |

### `ContentFilterParams`
Internal shape passed from hooks to API service functions.

| Field | Type | Default | Semantics |
|-------|------|---------|-----------|
| `countries` | `string[]` | `['US']` | ISO 3166-1 codes; `[]` = no restriction ("Select All") |
| `languages` | `string[]` | `['en']` | ISO 639-1 codes; `[]` = no restriction ("Select All") |

## Context Entity

### `ContentFilterContextValue`
Lives in `src/context/ContentFilterContext.tsx`. Session-only (no persistence).

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `countries` | `string[]` | `['US']` | Selected ISO 3166-1 country codes |
| `languages` | `string[]` | `['en']` | Selected ISO 639-1 language codes |
| `setCountries` | `(v: string[]) => void` | — | Replace country selection |
| `setLanguages` | `(v: string[]) => void` | — | Replace language selection |
| `filterKey` | `string` | `'US-en'` | Computed: `countries.join(',') + '-' + languages.join(',')`. Embedded in all `useApi` cache keys. |

### State Transitions

```
Initial load:
  countries = ['US'], languages = ['en']  (US + English defaults)

User opens Country dropdown → selects "Select All":
  countries = []  (all countries — no restriction)

User opens Country dropdown → selects individual country (e.g., "KR"):
  countries = ['KR']  ("Select All" auto-deselected)

User selects additional country (e.g., adds "FR"):
  countries = ['KR', 'FR']

User clicks "Select All" again:
  countries = []
```

## Existing Types — No Changes

All existing TMDB types (`Movie`, `Genre`, `TrendingResponse`, `DiscoverResponse`, etc.) are unchanged. The `Movie` entity already contains `original_language: string` which is used for client-side language filtering on the Search page.

## API Parameter Mapping

| ContentFilter value | TMDB param | TMDB value example |
|---------------------|------------|--------------------|
| `countries: ['US']` | `with_origin_country` | `"US"` |
| `countries: ['US', 'FR', 'KR']` | `with_origin_country` | `"US\|FR\|KR"` |
| `countries: []` | *(param omitted)* | — |
| `languages: ['en']` | `with_original_language` | `"en"` |
| `languages: ['en', 'fr']` | `with_original_language` | `"en\|fr"` |
| `languages: []` | *(param omitted)* | — |
