# Contributing to Digital Clock

A sleek, blazing-fast digital clock with a built-in stopwatch — simple on the surface, thoughtfully engineered underneath.

Thank you for contributing. This document defines the engineering workflow, quality expectations, and submission format for this repository.

All examples below are copy-paste-ready.

## Table Of Contents

- [Contributing to Digital Clock](#contributing-to-digital-clock)
  - [Development Setup](#development-setup)
    - [Prerequisites](#prerequisites)
    - [Clone and install](#clone-and-install)
    - [Create the runtime environment file](#create-the-runtime-environment-file)
    - [Run locally](#run-locally)
    - [Run the production entrypoint locally](#run-the-production-entrypoint-locally)
  - [Project Conventions](#project-conventions)
    - [Module boundaries](#module-boundaries)
    - [Coding style](#coding-style)
    - [Behavioral compatibility](#behavioral-compatibility)
  - [Branching Strategy](#branching-strategy)
  - [Commit Conventions](#commit-conventions)
  - [Pre-PR Validation Checklist](#pre-pr-validation-checklist)
  - [Pull Request Requirements](#pull-request-requirements)
    - [PR title](#pr-title)
    - [PR description format](#pr-description-format)
  - [Git Merge Commit](#git-merge-commit)
    - [Git Merge Commit Message Rule](#git-merge-commit-message-rule)
    - [Git Merge Commit Extended Description Rule](#git-merge-commit-extended-description-rule)
  - [Release Tags](#release-tags)
  - [Issue and Change Quality Guidelines](#issue-and-change-quality-guidelines)
  - [Documentation Expectations](#documentation-expectations)
  - [License](#license)

## Development Setup

### Prerequisites

- Node.js `24.14.1`
- npm
- Git
- Docker (optional, for container validation)

### Clone and install

```bash
git clone git@github.com:Amnoor/Digital-Clock.git
cd Digital-Clock
npm ci
```

### Create the runtime environment file

`npm run dev` reads values from `.env`, so create that file first.

`.env`

```env
PORT=5500
DEBUG=true
```

### Run locally

```bash
npm run dev
```

### Run the production entrypoint locally

```bash
npm start
```

If `PORT` is not set, the production server listens on port `80`.

## Project Conventions

### Module boundaries

- `router.js` is the Node.js entrypoint.
- Server responsibilities stay inside `server-modules/`.
- Browser behavior stays inside `client-modules/`.
- Clock page entry files are `index.html` and `index.js`.
- Stopwatch page entry files are `stopwatch/index.html` and `stopwatch/index.js`.
- Shared styles live in `style/`, while stopwatch-specific styles live in `stopwatch/style/`.

### Coding style

- Use ES modules only (`import` and `export`).
- Follow the existing `4`-space indentation style in JavaScript and CSS.
- Keep paths lowercase and continue using `index.js` as the module entry filename pattern.
- Reuse existing helpers instead of duplicating logic.
- Keep comments short and meaningful.

### Behavioral compatibility

- Preserve the `/stopwatch` to `/stopwatch/` redirect behavior.
- Preserve the `/config.js` contract that defines `window.APP_CONFIG.DEBUG`.
- Preserve static file behavior for missing files, directory reads, permission-denied reads, and unexpected read failures.
- Preserve the security headers applied to static file responses.
- Preserve the 12-hour or 24-hour preference stored in `localStorage` as `clockMode`.

## Branching Strategy

Create branches from the default branch and use a clear prefix.

```bash
git checkout -b docs/update-release-v1-0-5-docs
```

Recommended branch prefixes:

- `feat/` for new functionality
- `fix/` for bug fixes
- `docs/` for documentation-only changes
- `refactor/` for internal restructuring without behavior changes
- `chore/` for maintenance tasks

## Commit Conventions

Use Conventional Commit style for branch commits.

Format:

```text
type(scope): concise summary
```

Examples:

```text
fix(static): handle permission and file-read errors explicitly
docs(readme): align Docker and runtime documentation with the v1.0.5 release line
chore(package): sync package metadata for the next release
refactor(router): simplify static request flow
```

Use messages that describe the actual change, not generic activity.

## Pre-PR Validation Checklist

No automated test framework is configured yet, so validate changes manually before opening a pull request.

```text
[ ] npm run dev starts successfully.
[ ] The home page loads and the clock updates every second.
[ ] The 12h/24h toggle works and persists through localStorage.
[ ] The stopwatch Start, Stop, and Reset controls behave correctly.
[ ] /stopwatch redirects to /stopwatch/.
[ ] /config.js reflects the current DEBUG value.
[ ] Missing paths still serve 404.html.
[ ] Docker image builds and runs successfully when runtime or container behavior changed.
[ ] README.md and CONTRIBUTING.md are updated when behavior, configuration, Docker usage, versioning, or workflow guidance changed.
```

Optional Docker smoke test:

```bash
docker build -t digital-clock:local .
docker run --rm -p 8080:80 digital-clock:local
```

Then verify:

```text
http://localhost:8080/
http://localhost:8080/stopwatch/
```

## Pull Request Requirements

### PR title

Use Git-style PR titles.

Copy-paste title examples:

```text
fix: handle static file permission and read failures explicitly
docs: update README and CONTRIBUTING for the v1.0.5 release line
chore: align package metadata for the next release
```

### PR description format

PR descriptions must contain only these `3` sections:

- `Summary`
- `Files Changed`
- `Key Changes`

Use this exact copy-paste template:

```markdown
## Summary

Describe the change at a high level and explain why it is needed.

## Files Changed

Added:
- None

Modified:
- `path/`
  - `to/`
    - `modified-file`

Deleted:
- None

## Key Changes

- Describe each meaningful behavior, architecture, release, or documentation change.
- Include important implementation details and edge-case handling when relevant.
- Include validation notes inside this section when the reviewer needs them, because the PR body should contain only these three sections.
```

Keep the section order exact.

## Git Merge Commit

### Git Merge Commit Message Rule

Use this exact copy-paste merge commit message template:

```text
Merge the "<source branch>" branch to the "<target branch>" branch
```

### Git Merge Commit Extended Description Rule

Do not use bullet points or numbering in merge commit extended descriptions.

Use plain paragraph text only.

When a PR is created through an assisted workflow, always provide the PR link together with a copy-paste-ready merge commit extended description, even if it was not explicitly requested.

Use this copy-paste template:

```text
This merge delivers <summary of the change> across the Digital Clock application and repository workflow. The update modifies <key files or modules> to achieve <primary outcome> while preserving the current behavior for <compatibility notes>. Validation was completed by running <commands> and manually verifying <runtime behavior>. Documentation and workflow guidance were updated where needed so future contributors and reviewers can follow the same release-ready process.
```

## Release Tags

Keep release version metadata aligned before tagging a release. If the release version changes, update both `package.json` and `package-lock.json` together.

Release tags use the format `v<major>.<minor>.<patch>`.

Copy-paste release example:

```bash
git tag v1.0.5
git push origin v1.0.5
```

Pushing the tag triggers `.github/workflows/docker-push.yml`, which publishes `linux/amd64` and `linux/arm64` images to Docker Hub and GHCR and also updates the `latest` tag.

## Issue and Change Quality Guidelines

When opening or updating issues and pull requests, include:

- Reproducible steps
- Expected behavior
- Actual behavior
- Relevant logs or screenshots when useful
- Environment details when setup affects the result

## Documentation Expectations

If a change alters behavior, configuration, routes, Docker usage, release workflow, version references, or contributor workflow, update the affected documentation in the same PR.

Documentation in this repository should stay precise, current, and copy-paste-ready.

## License

By contributing, you agree that your contributions are provided under the MIT License in [`LICENSE`](/LICENSE).
