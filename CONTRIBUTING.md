# Contributing to Digital Clock

A sleek, blazing-fast digital clock with a built-in stopwatch — simple on the surface, thoughtfully engineered underneath.

Thank you for contributing. This document defines the engineering workflow, quality expectations, and submission format for this repository.

All examples below are copy-paste-ready.

## Table Of Contents

- [Contributing to Digital Clock](#contributing-to-digital-clock)
  - [Development Setup](#development-setup)
    - [Prerequisites](#prerequisites)
    - [Clone and install](#clone-and-install)
    - [Set runtime environment values](#set-runtime-environment-values)
    - [Run locally](#run-locally)
    - [Run production entrypoint locally](#run-production-entrypoint-locally)
  - [Branching Strategy](#branching-strategy)
  - [Commit Conventions](#commit-conventions)
  - [Engineering Standards](#engineering-standards)
    - [JavaScript and module boundaries](#javascript-and-module-boundaries)
    - [Behavioral compatibility](#behavioral-compatibility)
    - [Accessibility and UI behavior](#accessibility-and-ui-behavior)
  - [Pre-PR Validation Checklist](#pre-pr-validation-checklist)
  - [Pull Request Requirements](#pull-request-requirements)
    - [PR title](#pr-title)
    - [PR description format](#pr-description-format)
  - [Git Merge Commit](#git-merge-commit)
    - [Git Merge Commit Message Rule](#git-merge-commit-message-rule)
    - [Git Merge Commit Extended Description Rule](#git-merge-commit-extended-description-rule)
  - [Issue and Change Quality Guidelines](#issue-and-change-quality-guidelines)
  - [Documentation Expectations](#documentation-expectations)
  - [License](#license)


## Development Setup

### Prerequisites

- Node.js 24.13.1 (LTS)
- npm
- Git
- Docker (optional, for container validation)

### Clone and install

```bash
git clone git@github.com:Amnoor/Digital-Clock.git
cd Digital-Clock
npm ci
```

### Set runtime environment values

Set runtime environment values for `npm run dev` or else the command will throw a error message.

`.env` file:
```env
PORT=5500
DEBUG=true
```

### Run locally

```bash
npm run dev
```

### Run production entrypoint locally

```bash
npm start
```

## Branching Strategy

Create feature/fix branches from the default branch.

```bash
git checkout -b feat/add-clock-improvement
```

Recommended branch prefixes:

- `feat/` for new functionality.
- `fix/` for bug fixes.
- `docs/` for documentation-only changes.
- `refactor/` for internal restructuring without behavior changes.
- `chore/` for maintenance tasks.

## Commit Conventions

Use Git/Conventional Commit style.

Format:

```text
type(scope): concise summary
```

Examples:

```text
feat(clock): add seconds transition smoothing
fix(stopwatch): prevent double-start race in RAF loop
docs(readme): clarify Docker Hub run instructions
refactor(router): simplify static file resolution path
```

Use clear, intentional messages that describe the behavior change.

## Engineering Standards

### JavaScript and module boundaries

- Keep ESM usage consistent (`import`/`export`).
- Keep client concerns inside `client-modules/`.
- Keep server concerns inside `server-modules/`.
- Reuse existing helper modules instead of duplicating logic.

### Behavioral compatibility

- Preserve current route behavior unless the change explicitly intends to alter it.
- Preserve `/stopwatch` -> `/stopwatch/` redirect behavior.
- Preserve dynamic `/config.js` contract (`window.APP_CONFIG.DEBUG`).
- Preserve static file handling and 404 fallback behavior.

### Accessibility and UI behavior

- Keep navigation controls keyboard-accessible.
- Preserve ARIA behaviors currently used in navigation and page headings.
- Avoid introducing disruptive visual regressions on mobile breakpoints.

## Pre-PR Validation Checklist

Validate your changes before opening a pull request.

```text
[ ] Application starts with npm run dev.
[ ] Home page loads and live clock updates every second.
[ ] 12h/24h toggle works and preference persists in localStorage.
[ ] Stopwatch Start/Stop/Reset behavior is correct.
[ ] /stopwatch redirects to /stopwatch/.
[ ] /config.js responds and reflects DEBUG state.
[ ] Static assets and 404 behavior still work.
[ ] Docker image builds and runs successfully (if changes impact runtime/container).
[ ] Documentation updated when behavior/config/workflow changes.
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

Use Git conventions.

Copy-paste title examples:

```text
feat: add keyboard shortcuts for stopwatch controls
fix: correct config endpoint cache-control behavior
docs: add contribution workflow and release notes guidance
```

### PR description format

PR descriptions must contain only these 3 sections:

- `Summary`
- `Files Changed`
- `Key Changes`

Copy-paste PR description template:

```markdown
## Summary

Describe the change at a high level and explain why it is needed.

## Files Changed

Added:
- `path/`
  - `to/`
    - `new-file`

Modified:
- `path/`
  - `to/`
    - `modified-file`

Deleted:
- `path/`
  - `to/`
    - `old-file`

## Key Changes

- Describe each meaningful behavior, architecture, or workflow change.
- Include important implementation details and edge-case handling.
- Mention validation/testing performed.
```

Keep this format exact.

## Git Merge Commit

### Git Merge Commit Message Rule

Use this Copy-paste merge commit message template:
```text
Merge the "<base branch>" branch to the "<target branch>" branch
```

### Git Merge Commit Extended Description Rule

Do not use bulletins or numberings in merge commit extended descriptions.

Use plain paragraph text only.

Copy-paste merge commit extended description template:
```text
This merge introduces the finalized implementation for <feature/fix> across the Digital Clock application. The change updates <key files/modules> to deliver <primary outcome> while preserving existing behavior for <compatibility notes>. Validation was completed by running <commands/checks> and manually verifying <runtime behaviors>. This merge also updates documentation and workflow notes where relevant so contributors and reviewers can follow the new behavior consistently.
```

## Issue and Change Quality Guidelines

When opening or updating issues and PRs, include:

- Reproducible steps.
- Expected behavior.
- Actual behavior.
- Relevant logs or screenshots when useful.
- Environment details when behavior differs by setup.

## Documentation Expectations

If your change alters behavior, configuration, routes, release flow, or Docker usage, update affected docs in the same PR.

Documentation should remain precise, up-to-date, and copy-paste-ready.

## License

By contributing, you agree that your contributions are provided under the repository MIT License found at [`LICENSE`](/LICENSE).