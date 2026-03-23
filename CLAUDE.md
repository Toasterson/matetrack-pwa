# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MateTrack is a vanilla JS Progressive Web App for tracking expenses at events. No build step, no framework — just HTML/CSS/JS served by nginx. All data is stored in browser localStorage (no backend).

## Development Commands

```bash
# Run dev server (live reload)
npm run dev

# Run dev server (no live reload)
npm run start

# Both serve public/ on port 8080 via npx serve

# Docker (standard nginx:alpine)
docker build -t matetrack:latest .
docker run -d -p 8080:80 --name matetrack-local matetrack:latest

# Docker (Chainguard distroless, matches production)
docker build -f Dockerfile.chainguard -t matetrack:chainguard .
# Chainguard variant listens on port 8080

# Helm chart
helm package helm/matetrack
helm push matetrack-*.tgz oci://ghcr.io/toasterson/matetrack-pwa/helm
```

There are no tests, linting, or build steps. Testing is manual via browser and Lighthouse audits.

## Architecture

### Single-class app (`public/app.js`)
`MateTrackApp` manages four data collections, each backed by a localStorage key:
- `matetrack_expenses` — manual expenses with amount/description/category
- `matetrack_drinks` — drink inventory (name, price, quantity)
- `matetrack_grabs` — quick grab log (tapping a drink button auto-creates an expense too)
- `matetrack_register` — payments made to event organizer; balance = register payments - total expenses

The class follows a pattern: add item → save to localStorage → re-render affected lists → update summary displays. Global instance lives at `window.app`.

### Service Worker (`public/sw.js`)
Cache-first strategy (`matetrack-v1` cache). When updating cached resources, bump the `CACHE_NAME` version string so the activate event clears stale caches.

### Two Dockerfiles
- `Dockerfile` — standard `nginx:alpine`, listens on port 80, uses `nginx-standard.conf`
- `Dockerfile.chainguard` — `cgr.dev/chainguard/nginx:latest`, listens on port 8080, uses `nginx.conf` (configured for non-root user and read-only filesystem)

Production deployments use the Chainguard variant via Helm chart (`helm/matetrack/`).

### CI/CD (`.github/workflows/docker-build.yml`)
Builds multi-arch (amd64/arm64) images for both Dockerfile variants, pushes to `ghcr.io/toasterson/matetrack-pwa`, and packages+publishes the Helm chart to OCI registry. Triggered on push to main/develop and tags.

## Key Conventions

- Currency symbol is hardcoded as `$` throughout `app.js` and `index.html`
- CSS theming uses CSS custom properties in `public/styles.css`
- Expense categories are defined as `<option>` elements in `index.html` (not in JS)
- IDs use `Date.now()` — quick grabs create two entries (grab + expense) with ids `Date.now()` and `Date.now() + 1`
