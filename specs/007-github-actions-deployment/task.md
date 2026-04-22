# Tasks: GitHub Actions Deployment

**Branch**: `007-github-actions-deployment` | **Spec**: [./spec.md](./spec.md) | **Plan**: [./plan.md](./plan.md)
**Input**: Design documents from `/specs/007-github-actions-deployment/`
**Prerequisites**: spec.md (required), plan.md (required), checklists/requirements.md (passed)
**Status**: COMPLETED (2026-04-21)

## Format: `[ID] [P?] [USn] Description`

- **[P]**: Can run in parallel (different files, no shared dependencies)
- **[USn]**: User story this task belongs to (US1, US2...)
- Include exact file paths in task descriptions

---

## Phase 1: Setup & Infrastructure

- [x] T6 [US2] Configure GitHub Secrets — add `VITE_TMDB_API_KEY` to repository Settings > Secrets, verify secret value, document setup
  - [x] Add VITE_TMDB_API_KEY to Settings > Secrets
  - [x] Verify secret value
  - [x] Document secret setup

- [x] T7 [P] [US1] Configure GitHub Pages Settings — enable GitHub Pages, select GitHub Actions source, configure main branch, verify custom domain settings
  - [x] Enable GitHub Pages
  - [x] Select GitHub Actions source
  - [x] Configure main branch
  - [x] Verify custom domain settings (if any)

---

## Phase 2: Foundational (Shared Prerequisites)

- [x] T8 [P] [US1] Update `vite.config.ts` — set base path to `/cinescope-vod-sdd/`, configure build output directory to dist, enable production optimisation
  - [x] Set vite.config.ts base path
  - [x] Base path: `/cinescope-vod-sdd/`
  - [x] Build output directory: dist
  - [x] Production optimization

- [x] T9 [P] [US1] Update React Router configuration in `src/App.tsx` — add basename `/cinescope-vod-sdd/` to BrowserRouter, test routing in production
  - [x] Add basename to BrowserRouter
  - [x] Basename: `/cinescope-vod-sdd/`
  - [x] Test routing in production

---

## Phase 3: CI/CD Pipeline (US1) — Priority: P1 🎯 MVP

- [x] T1 [US1] Create `.github/workflows/deploy.yaml` — configure `on: push` to main, add `workflow_dispatch` for manual triggers, set permissions for GitHub Pages
  - [x] Create `.github/workflows/deploy.yaml`
  - [x] Configure on: push to main
  - [x] Add workflow_dispatch for manual triggers
  - [x] Set permissions for GitHub Pages

- [x] T2 [US1] Build Stage Configuration — checkout code (actions/checkout@v4), setup Node.js 18 (setup-node@v4), enable npm caching, run `npm ci`, execute `npm run build`
  - [x] Checkout code (actions/checkout@v4)
  - [x] Setup Node.js 18 (setup-node@v4)
  - [x] Enable npm caching
  - [x] Run npm ci (clean install)
  - [x] Execute npm run build

- [x] T3 [US2] Environment Variable Handling — add `VITE_TMDB_API_KEY` to env in workflow, reference GitHub Secrets, ensure env vars available during build
  - [x] Add VITE_TMDB_API_KEY to env in workflow
  - [x] Reference GitHub Secrets
  - [x] Environment variables available during build

- [x] T4 [US1] Deploy Stage Configuration — add job dependency (`needs: build`), configure GitHub Pages environment, use `actions/deploy-pages@v4`, enable artifact deployment
  - [x] Add job dependency (needs: build)
  - [x] Configure GitHub Pages environment
  - [x] Use actions/deploy-pages@v4
  - [x] Enable artifact deployment

- [x] T5 [P] [US1] Concurrency Control — add concurrency group, cancel in-progress deployments, prevent duplicate builds
  - [x] Add concurrency group
  - [x] Cancel in-progress deployments
  - [x] Prevent duplicate builds

---

## Phase 4: Verification & Documentation

- [x] T10 [US1] First Deployment — push to main branch, monitor workflow in Actions tab, verify build succeeds, verify deployment completes, test live site at GitHub Pages URL
  - [x] Push to main branch
  - [x] Monitor workflow in Actions tab
  - [x] Verify build succeeds
  - [x] Verify deployment completes
  - [x] Test live site at GitHub Pages URL

- [x] T11 [US1] Post-Deployment Verification — visit GitHub Pages URL, verify all pages load, test navigation, verify images display, test mobile responsiveness, check search functionality
  - [x] Visit GitHub Pages URL
  - [x] Verify all pages load
  - [x] Test navigation functionality
  - [x] Verify images display
  - [x] Test mobile responsiveness
  - [x] Check search functionality

- [x] T12 [P] [US2] Documentation — document workflow in README, document secret setup, document base path configuration, deployment process, add troubleshooting guide
  - [x] Document workflow in README
  - [x] Document secret setup
  - [x] Document base path configuration
  - [x] Document deployment process
  - [x] Add troubleshooting guide

---

## Quality Checklist

### Workflow Correctness
- [x] YAML syntax valid
- [x] All steps run successfully
- [x] No secrets exposed in logs
- [x] Build artifacts uploaded
- [x] Deployment completes

### Build Process
- [x] Dependencies installed
- [x] TypeScript compiles
- [x] Vite bundles correctly
- [x] Assets optimized
- [x] Build time <1 minute

### Deployment
- [x] Artifacts uploaded to Pages
- [x] Site becomes live
- [x] HTTPS enforced
- [x] URL correct
- [x] All pages accessible

### Testing
- [x] Homepage loads
- [x] Trending page works
- [x] Top-rated page works
- [x] Navigation functional
- [x] Images display
- [x] Responsive works

### Configuration
- [x] Base path correct
- [x] ENV variables set
- [x] React Router basename set
- [x] GitHub Pages enabled
- [x] Workflow permissions correct

## Acceptance Criteria Status

| Criterion | Status | Notes |
|-----------|--------|-------|
| Workflow created | ✅ | deploy.yaml in .github/workflows |
| Builds on push | ✅ | Automatic trigger on main |
| Manual dispatch works | ✅ | workflow_dispatch enabled |
| Deploys successfully | ✅ | deploy-pages action works |
| Site accessible | ✅ | Live at GitHub Pages URL |
| Navigation works | ✅ | All routes functional |
| Base path correct | ✅ | /cinescope-vod-sdd/ setup |
| Environment vars set | ✅ | Secrets configured |
| Mobile responsive | ✅ | Deployed site responsive |
| Images load | ✅ | Assets available on Pages |

## Deployment Checklist
- [x] Repository public on GitHub
- [x] .github/workflows/deploy.yaml created
- [x] VITE_TMDB_API_KEY added to Secrets
- [x] vite.config.ts base path set
- [x] src/App.tsx basename configured
- [x] GitHub Pages enabled
- [x] Deploy source set to GitHub Actions
- [x] First deployment successful
- [x] Site live and functional
- [x] Team notified

## Continuous Deployment Workflow

### Normal Development
1. Make code changes
2. Test locally
3. Commit and push to main
4. GitHub Actions triggers automatically
5. Site deployed to GitHub Pages
6. Changes live within 2-3 minutes

### Manual Deployment (if needed)
1. Go to Actions tab
2. Select deploy workflow
3. Click "Run workflow"
4. Select main branch
5. Wait for build and deploy

## Checkpoint
✅ CI/CD pipeline complete and operational. All commits to main automatically deploy to GitHub Pages.

## Notes
- Zero downtime deployments
- Automatic rollback possible (revert commit)
- No manual FTP or server access needed
- Free hosting through GitHub Pages
- Perfect for static site hosting
- Scales with project needs

---

## Dependencies & Execution Order

### Phase Dependencies
- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 — blocks all user story work
- **User Stories (Phase 3+)**: All depend on Phase 2 completion
- **Polish (Final Phase)**: Depends on all user story phases complete

### Parallel Opportunities
- T6 (GitHub Secrets) and T7 (GitHub Pages Settings) in Phase 1 can run in parallel
- T8 (Vite Config) and T9 (React Router Config) in Phase 2 can run in parallel
- T5 (Concurrency Control) in Phase 3 is an independent YAML section — can be written in parallel with T1
- T12 (Documentation) in Phase 4 can run in parallel with T10/T11

---

## Implementation Strategy

### MVP First
1. Complete Phase 1: Setup (T6, T7)
2. Complete Phase 2: Foundational (T8, T9)
3. Complete Phase 3: CI/CD Pipeline (T1, T2, T3, T4) 🎯
4. STOP and VALIDATE independently

### Incremental Delivery
- After Phase 3 (US1): Deploy and validate → MVP
- After Phase 4 (US2 documentation): Complete audit trail → deploy
- Verification phase last

---

## Notes
- [P] = different files, no shared dependencies — safe to parallelise
- [USn] label maps task to user story for traceability
- Commit after each phase checkpoint
- All sub-tasks within a parent task run sequentially unless marked [P]
