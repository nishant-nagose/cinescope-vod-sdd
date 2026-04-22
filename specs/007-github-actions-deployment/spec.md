# Feature Specification: GitHub Actions Deployment

**Feature Branch**: `007-github-actions-deployment`
**Created**: 2026-04-21
**Status**: COMPLETED
**Input**: Deployment automation for CineScope to GitHub Pages

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Automatic Deployment (Priority: P1)
As a developer, I want the application to automatically deploy to GitHub Pages when I push code to main so that I don't have to manually deploy.

**Why this priority**: Automation reduces human error and improves development velocity.

**Independent Test**: Push code to main and verify deployment completes within 5 minutes.

**Acceptance Scenarios**:
1. **Given** code is pushed to main, **When** the workflow runs, **Then** the application builds successfully.
2. **Given** the build completes, **When** artifacts are uploaded, **Then** the site deploys to GitHub Pages.
3. **Given** environment variables are set, **When** the build runs, **Then** the API key is available to the application.
4. **Given** the deployment completes, **When** the site is accessed, **Then** all pages load correctly.

### User Story 2 - Environment Security (Priority: P1)
As a security-minded developer, I want API keys to be managed securely via GitHub Secrets so that they're not exposed in source code.

**Why this priority**: Security is non-negotiable.

**Acceptance Scenarios**:
1. **Given** the repository is setup, **When** I add a secret to GitHub, **Then** the workflow can access it during build.
2. **Given** the application builds, **When** the build completes, **Then** no secrets appear in logs or version history.
3. **Given** a new team member joins, **When** they clone the repository, **Then** they cannot access the production API key.

### Edge Cases
- **Large build**: If build takes >5 minutes, it completes but is marked as slow.
- **API rate limiting**: Workflow retry logic ensures resilience.
- **Network failures**: GitHub Actions retries failed steps automatically.
- **Secret rotation**: Secrets can be updated; next deployment uses new values.

---

## Requirements *(mandatory)*

### Functional Requirements
- **FR-001**: The GitHub Actions workflow MUST trigger automatically on push to main branch.
- **FR-002**: The workflow MUST compile TypeScript, bundle with Vite, and produce dist artifacts.
- **FR-003**: Environment variables (VITE_TMDB_API_KEY) MUST be injected during build from GitHub Secrets.
- **FR-004**: The build MUST be optimized for production (minification, CSS purging).
- **FR-005**: Artifacts MUST be deployed to GitHub Pages automatically.
- **FR-006**: The site MUST be accessible at: https://nishant-nagose.github.io/cinescope-vod-sdd/
- **FR-007**: The base path /cinescope-vod-sdd/ MUST be configured in Vite and React Router.
- **FR-008**: Manual workflow dispatch MUST be available for triggering deployments.
- **FR-009**: Concurrent deployments MUST be prevented.

### Technical Requirements
- **GitHub Actions**: `.github/workflows/deploy.yaml`
- **Node.js**: version 18 LTS
- **Dependencies**: npm, Vite, TypeScript, React Router
- **Build Command**: `npm run build`
- **Output**: `dist/` directory with static files
- **Pages Deployment**: Official `actions/deploy-pages@v4`

### Key Entities
- **Workflow**: GitHub Actions YAML config
- **Artifact**: Built dist/ directory
- **Secret**: VITE_TMDB_API_KEY environment variable

## Success Criteria *(mandatory)*

### Measurable Outcomes
- **SC-001**: Automatic deployment triggers on every main push (validated via Actions tab).
- **SC-002**: Build success rate is 100% with no build failures.
- **SC-003**: Environment injection makes API key available during build (logged at app startup).
- **SC-004**: GitHub Pages hosting makes the site accessible at the GitHub Pages URL.
- **SC-005**: Base path `/cinescope-vod-sdd/` is configured and all site navigation works correctly.
- **SC-006**: Deployment time is under 5 minutes measured from push to live.
- **SC-007**: Security audit confirms no secrets are exposed in logs or version history.
- **SC-008**: Manual trigger via workflow_dispatch succeeds for all deployments.

## Assumptions

- GitHub repository is public (required for GitHub Pages).
- GitHub Pages is enabled in repository settings.
- Team members have permission to manage Secrets.
- All deployments should target main branch.
- Production builds are the source of truth.

## Out of Scope

- Custom domain setup (using default GitHub Pages domain)
- SSL certificate management (handled by GitHub)
- Staging environment deployment
- Rollback automation (manual via revert commit)

## Deployment Architecture Diagram

```
Developer
    ↓
Push to main
    ↓
GitHub Actions Trigger
    ↓
    ├─ Build Job
    │  ├─ Checkout code
    │  ├─ Setup Node.js 18
    │  ├─ npm ci
    │  ├─ npm run build (with env vars from Secrets)
    │  └─ Upload artifacts
    │
    └─ Deploy Job
       ├─ Download artifacts
       ├─ Deploy to GitHub Pages
       └─ Site goes live
    ↓
GitHub Pages
    ↓
https://nishant-nagose.github.io/cinescope-vod-sdd/
```

## Configuration Files

### Environment Variables (GitHub Secrets)
- `VITE_TMDB_API_KEY`: The Movie Database API key

### Application Configuration
- **vite.config.ts**: `base: '/cinescope-vod-sdd/'`
- **src/App.tsx**: `<BrowserRouter basename="/cinescope-vod-sdd/">`

### Workflow Configuration
- **.github/workflows/deploy.yaml**: Build and deploy pipeline

## Related Documentation
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#github-pages)
- [React Router Basename Setup](https://stackoverflow.com/questions/35562287/how-do-i-fix-the-routing-in-my-deployed-create-react-app)

## Notes

### Security Best Practices
- API keys never stored in source code
- Secrets accessed only during build
- No logs display secret values
- Only team members with repo access can manage secrets

### Performance Notes
- Production build optimizes CSS and JavaScript
- Tailwind purges unused utilities
- Image lazy loading in place
- Bundle size optimized for mobile

### Deployment Process
1. **Development**: Work on feature branches
2. **Testing**: Test locally before pushing
3. **Integration**: Push to main branch
4. **Automation**: GitHub Actions builds and deploys
5. **Production**: Site live within minutes
