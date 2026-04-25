<!-- SPECKIT START -->
**CineScope POC is fully complete as of 2026-04-25.**
All 11 feature specs (001–011) have been implemented and the codebase has been cleaned up.

For project architecture, tech stack, and shell commands, see the constitution:
- **Constitution**: `.specify/memory/constitution.md`
- **Latest spec**: `specs/011-shows-content-modernization/`

### Key source structure
- `src/components/` — 29 UI components (MovieCarousel, ShowCarousel, HeroSlider, DynamicCarousel, etc.)
- `src/hooks/` — 15 active hooks only (useApi, useInfiniteMovies, useInfiniteShows, useContentSearch, detail/media/metadata hooks)
- `src/pages/` — 6 pages (HomePage, TrendingPage, TopRatedPage, SearchPage, MovieDetailPage, ShowDetailPage)
- `src/services/` — tmdbApi.ts, cache.ts, errorHandling.ts
- `src/config/` — carouselPool.ts (60+ carousel defs), ottProviders.ts
- `src/utils/` — genreKeyMap.ts, carouselTitles.ts, ottNavigation.ts
- `src/context/` — ContentFilterContext.tsx
- `src/types/` — tmdb.ts

### Shell commands
- `npm run dev` — start dev server (Vite, port 5173)
- `npm test` — run Vitest test suite (13 test files)
- `npm run build` — TypeScript + Vite production build
- `npx tsc --noEmit` — TypeScript type check only
<!-- SPECKIT END -->






<!-- cloude-code-toolbox:mcp-skills-awareness-begin -->

### MCP & Skills awareness (Cloude Code ToolBox)

_Last synced: 2026-04-23T08:32:20.856Z._

- **Full report:** `.claude/cloude-code-toolbox-mcp-skills-awareness.md` in this workspace (auto-overwritten on each scan). Use it as ground truth for configured servers and skill folders.
- **MCP:** For **live tools** in Claude Code, enable the matching server via `/mcp` (and VS Code `mcp.json` where applicable).
- **When the user’s task matches a server** (e.g. Confluence work and a **Confluence** / **Atlassian** MCP is listed), **prefer that server id** and plan on tool use—not only file search.
- **Skills:** Folders below contain `SKILL.md`; attach or cite paths in chat when relevant.

#### Workspace MCP

- `d:\AI\SDD_AOD\vod-sdd-app-specKit\CineScope\.vscode\mcp.json` _(workspace: CineScope)_ — _file missing_

_No active workspace servers in mcp.json._

#### User MCP

- `C:\Users\nishant.nagose.ASCENDION\AppData\Roaming\Code\User\mcp.json` — _servers defined_

| Server id | Kind | Detail |
|-----------|------|--------|
| playwright | stdio | npx @playwright/mcp@latest |

#### Project skills

- **speckit-analyze** — `d:\AI\SDD_AOD\vod-sdd-app-specKit\CineScope\.claude\skills\speckit-analyze` — Perform a non-destructive cross-artifact consistency and quality analysis across spec.md, plan.md, and tasks.md after task generation.

- **speckit-checklist** — `d:\AI\SDD_AOD\vod-sdd-app-specKit\CineScope\.claude\skills\speckit-checklist` — Generate a custom checklist for the current feature based on user requirements.

- **speckit-clarify** — `d:\AI\SDD_AOD\vod-sdd-app-specKit\CineScope\.claude\skills\speckit-clarify` — Identify underspecified areas in the current feature spec by asking up to 5 highly targeted clarification questions and encoding answers back into the spec.

- **speckit-constitution** — `d:\AI\SDD_AOD\vod-sdd-app-specKit\CineScope\.claude\skills\speckit-constitution` — Create or update the project constitution from interactive or provided principle inputs, ensuring all dependent templates stay in sync.

- **speckit-git-commit** — `d:\AI\SDD_AOD\vod-sdd-app-specKit\CineScope\.claude\skills\speckit-git-commit` — Auto-commit changes after a Spec Kit command completes

- **speckit-git-feature** — `d:\AI\SDD_AOD\vod-sdd-app-specKit\CineScope\.claude\skills\speckit-git-feature` — Create a feature branch with sequential or timestamp numbering

- **speckit-git-initialize** — `d:\AI\SDD_AOD\vod-sdd-app-specKit\CineScope\.claude\skills\speckit-git-initialize` — Initialize a Git repository with an initial commit

- **speckit-git-remote** — `d:\AI\SDD_AOD\vod-sdd-app-specKit\CineScope\.claude\skills\speckit-git-remote` — Detect Git remote URL for GitHub integration

- **speckit-git-validate** — `d:\AI\SDD_AOD\vod-sdd-app-specKit\CineScope\.claude\skills\speckit-git-validate` — Validate current branch follows feature branch naming conventions

- **speckit-implement** — `d:\AI\SDD_AOD\vod-sdd-app-specKit\CineScope\.claude\skills\speckit-implement` — Execute the implementation plan by processing and executing all tasks defined in tasks.md

- **speckit-plan** — `d:\AI\SDD_AOD\vod-sdd-app-specKit\CineScope\.claude\skills\speckit-plan` — Execute the implementation planning workflow using the plan template to generate design artifacts.

- **speckit-specify** — `d:\AI\SDD_AOD\vod-sdd-app-specKit\CineScope\.claude\skills\speckit-specify` — Create or update the feature specification from a natural language feature description.

- **speckit-tasks** — `d:\AI\SDD_AOD\vod-sdd-app-specKit\CineScope\.claude\skills\speckit-tasks` — Generate an actionable, dependency-ordered tasks.md for the feature based on available design artifacts.

- **speckit-taskstoissues** — `d:\AI\SDD_AOD\vod-sdd-app-specKit\CineScope\.claude\skills\speckit-taskstoissues` — Convert existing tasks into actionable, dependency-ordered GitHub issues for the feature based on available design artifacts.

#### User skills

_None found._

<!-- cloude-code-toolbox:mcp-skills-awareness-end -->
