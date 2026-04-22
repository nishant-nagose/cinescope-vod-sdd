# Cloude Code ToolBox — MCP & Skills awareness

_Generated: 2026-04-22T07:32:31.178Z_

## How to use this report

- **Saved copy:** This file is **`.claude/cloude-code-toolbox-mcp-skills-awareness.md`** — refreshed whenever the toolbox runs an MCP & Skills scan (including on workspace open when auto-scan is enabled). It is meant for **Claude Code workspace context** together with `CLAUDE.md` (which gets a shorter replaceable summary when auto-merge is on).
- **MCP:** Lists **configured** servers from VS Code `mcp.json`. **Claude Code** uses `~/.claude/settings.json` and `/mcp` in the panel for its own MCP list — align or port configs as needed.
- **Skills:** **On-disk** folders with `SKILL.md`. Claude Code does not auto-load them; attach `SKILL.md` or paths in chat when useful.
- **Task routing:** When the user’s request matches a server’s purpose (e.g. Confluence → Confluence/Atlassian MCP), prefer that **server id** from the tables below.

---

## MCP — workspace

Workspace `mcp.json` _(folder: CineScope)_

- **d:\AI\SDD_AOD\vod-sdd-app-specKit\CineScope\.vscode\mcp.json** — _File missing_

_No active workspace servers in mcp.json._

## MCP — user profile

- **C:\Users\nishant.nagose.ASCENDION\AppData\Roaming\Code\User\mcp.json** — _File exists — servers defined_

| Server id | Kind | Detail |
|-----------|------|--------|
| playwright | stdio | npx @playwright/mcp@latest |

## Skills (local `SKILL.md` folders)

### Project-scoped

- **speckit-analyze** — `d:\AI\SDD_AOD\vod-sdd-app-specKit\CineScope\.claude\skills\speckit-analyze`
  - Perform a non-destructive cross-artifact consistency and quality analysis across spec.md, plan.md, and tasks.md after task generation.

- **speckit-checklist** — `d:\AI\SDD_AOD\vod-sdd-app-specKit\CineScope\.claude\skills\speckit-checklist`
  - Generate a custom checklist for the current feature based on user requirements.

- **speckit-clarify** — `d:\AI\SDD_AOD\vod-sdd-app-specKit\CineScope\.claude\skills\speckit-clarify`
  - Identify underspecified areas in the current feature spec by asking up to 5 highly targeted clarification questions and encoding answers back into the spec.

- **speckit-constitution** — `d:\AI\SDD_AOD\vod-sdd-app-specKit\CineScope\.claude\skills\speckit-constitution`
  - Create or update the project constitution from interactive or provided principle inputs, ensuring all dependent templates stay in sync.

- **speckit-git-commit** — `d:\AI\SDD_AOD\vod-sdd-app-specKit\CineScope\.claude\skills\speckit-git-commit`
  - Auto-commit changes after a Spec Kit command completes

- **speckit-git-feature** — `d:\AI\SDD_AOD\vod-sdd-app-specKit\CineScope\.claude\skills\speckit-git-feature`
  - Create a feature branch with sequential or timestamp numbering

- **speckit-git-initialize** — `d:\AI\SDD_AOD\vod-sdd-app-specKit\CineScope\.claude\skills\speckit-git-initialize`
  - Initialize a Git repository with an initial commit

- **speckit-git-remote** — `d:\AI\SDD_AOD\vod-sdd-app-specKit\CineScope\.claude\skills\speckit-git-remote`
  - Detect Git remote URL for GitHub integration

- **speckit-git-validate** — `d:\AI\SDD_AOD\vod-sdd-app-specKit\CineScope\.claude\skills\speckit-git-validate`
  - Validate current branch follows feature branch naming conventions

- **speckit-implement** — `d:\AI\SDD_AOD\vod-sdd-app-specKit\CineScope\.claude\skills\speckit-implement`
  - Execute the implementation plan by processing and executing all tasks defined in tasks.md

- **speckit-plan** — `d:\AI\SDD_AOD\vod-sdd-app-specKit\CineScope\.claude\skills\speckit-plan`
  - Execute the implementation planning workflow using the plan template to generate design artifacts.

- **speckit-specify** — `d:\AI\SDD_AOD\vod-sdd-app-specKit\CineScope\.claude\skills\speckit-specify`
  - Create or update the feature specification from a natural language feature description.

- **speckit-tasks** — `d:\AI\SDD_AOD\vod-sdd-app-specKit\CineScope\.claude\skills\speckit-tasks`
  - Generate an actionable, dependency-ordered tasks.md for the feature based on available design artifacts.

- **speckit-taskstoissues** — `d:\AI\SDD_AOD\vod-sdd-app-specKit\CineScope\.claude\skills\speckit-taskstoissues`
  - Convert existing tasks into actionable, dependency-ordered GitHub issues for the feature based on available design artifacts.

### User-scoped

_None found._

---

## Suggested next steps

- **MCP:** Command Palette → `MCP: List Servers` (or this extension’s hub **MCP** tab). In Claude Code, use `/mcp` to connect servers for the Claude session.
- **Edit config:** `MCP: Open Workspace Folder MCP Configuration` / `MCP: Open User Configuration`.
- **Refresh this report:** run **Intelligence — scan MCP & Skills awareness** again after changing `mcp.json` or adding skills.

_Report from Cloude Code ToolBox extension._
