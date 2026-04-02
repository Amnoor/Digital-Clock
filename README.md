# Digital Clock

A sleek, blazing-fast digital clock with a built-in stopwatch — simple on the surface, thoughtfully engineered underneath.

## Table Of Contents

- [Digital Clock](#digital-clock)
  - [Overview](#overview)
  - [Features](#features)
  - [Quick Start](#quick-start)
    - [Prerequisites](#prerequisites)
    - [1. Clone and install](#1-clone-and-install)
    - [2. Create the runtime environment file](#2-create-the-runtime-environment-file)
    - [3. Run in development mode](#3-run-in-development-mode)
    - [4. Run in production mode](#4-run-in-production-mode)
    - [5. Open in the browser](#5-open-in-the-browser)
  - [Runtime Configuration](#runtime-configuration)
  - [Routes](#routes)
  - [Architecture](#architecture)
    - [Server-side modules](#server-side-modules)
    - [Client-side modules](#client-side-modules)
    - [Request flow (high level)](#request-flow-high-level)
  - [Repository Structure](#repository-structure)
  - [Docker](#docker)
    - [Published images](#published-images)
    - [Pull and run from Docker Hub](#pull-and-run-from-docker-hub)
    - [Pull and run from GitHub Container Registry](#pull-and-run-from-github-container-registry)
    - [Run with runtime environment variables](#run-with-runtime-environment-variables)
    - [Build locally](#build-locally)
  - [Release Workflow](#release-workflow)
  - [Logging and Debugging](#logging-and-debugging)
  - [Security Notes](#security-notes)
  - [Contributing](#contributing)
  - [License](#license)

## Overview

Digital Clock exposes two user-facing pages:

- `/` serves the main clock page with a persistent 12-hour or 24-hour display toggle.
- `/stopwatch/` serves the stopwatch page with Start, Stop, and Reset controls.

The application is served by a modular Node.js HTTP server with no framework dependency. The current server code also handles common static file read failures more explicitly, returning safer and clearer `403`, `404`, and `500` responses depending on the underlying filesystem error.

## Features

- Live digital clock with seconds.
- 12-hour or 24-hour mode toggle persisted in `localStorage` as `clockMode`.
- Stopwatch built on `performance.now()` and `requestAnimationFrame` for monotonic elapsed timing.
- Responsive navigation for desktop and mobile layouts.
- Dynamic `/config.js` endpoint that exposes `window.APP_CONFIG.DEBUG` to the browser.
- Custom `404.html` handling for missing files and directories.
- Explicit static file read handling for `ENOENT`, `EISDIR`, `EACCES`, `EPERM`, `EMFILE`, and unexpected filesystem failures.
- Multi-stage Docker build with non-root runtime execution.
- Automated multi-architecture image publishing to Docker Hub and GHCR on release tags.

## Quick Start

### Prerequisites

- Node.js `24.14.1`
- npm
- Git

### 1. Clone and install

```bash
git clone git@github.com:Amnoor/Digital-Clock.git
cd Digital-Clock
npm ci
```

### 2. Create the runtime environment file

`npm run dev` loads values from `.env`, so create that file before starting the development server.

`.env`

```env
PORT=5500
DEBUG=true
```

### 3. Run in development mode

```bash
npm run dev
```

### 4. Run in production mode

```bash
npm start
```

If no `PORT` environment variable is set, the production server listens on port `80`.

### 5. Open in the browser

If you are using the sample `.env` shown above:

```text
http://localhost:5500/
http://localhost:5500/stopwatch/
```

If you are running with the default production port:

```text
http://localhost:80/
http://localhost:80/stopwatch/
```

## Runtime Configuration

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `PORT` | No | `80` | HTTP port used by the Node.js server. |
| `DEBUG` | No | `false` | Enables `log`, `debug`, and `trace` logging on both server and client. |

## Routes

| Route | Method | Behavior |
| --- | --- | --- |
| `/` | `GET` | Serves `index.html` for the digital clock page. |
| `/stopwatch` | `GET` | Sends a `301` redirect to `/stopwatch/`. |
| `/stopwatch/` | `GET` | Serves `stopwatch/index.html`. |
| `/config.js` | `GET` | Returns a generated script that defines `window.APP_CONFIG.DEBUG` and sets `Cache-Control: no-store`. |
| `/*` | `GET` | Serves static files, uses `404.html` for missing paths or directory reads, returns `403` for permission-denied file reads, and returns `500` for other read failures. |

## Architecture

### Server-side modules

- `router.js`: Application entrypoint that initializes logging, creates the request handler, and starts the HTTP server.
- `server-modules/server/`: HTTP server bootstrap and port binding.
- `server-modules/router/`: Request orchestration for config, redirect, and static file handling.
- `server-modules/paths/`: URL parsing and project root resolution.
- `server-modules/static/`: Static path resolution, stopwatch redirect, and file read response handling.
- `server-modules/config/`: Dynamic `/config.js` generation.
- `server-modules/responses/`: Shared helpers for redirects, `404`, and `500` responses.
- `server-modules/mime/`: File extension to content-type mapping.
- `server-modules/logs/`: Server logger with `DEBUG` gating.

### Client-side modules

- `client-modules/clock/`: Clock rendering and interval lifecycle.
- `client-modules/preferences/`: Saved clock mode loading and toggle persistence.
- `client-modules/stopwatch/`: Stopwatch timing state and button behavior.
- `client-modules/navigation/`: Mobile menu interactions and `aria-expanded` updates.
- `client-modules/logs/`: Browser logger with `DEBUG` gating.

### Request flow (high level)

1. `router.js` initializes the logger, creates the request handler, and starts the server.
2. The router parses the incoming request URL and checks for special handling for `/config.js` and `/stopwatch`.
3. Static requests are resolved to files under the project root and served with the correct MIME type and security headers.
4. Missing paths fall back to `404.html`, permission errors return `403`, and unexpected read failures return `500`.

## Repository Structure

```text
Digital-Clock/
├─ .github/
│  └─ workflows/
│     └─ docker-push.yml
├─ assets/
│  ├─ Mobile/
│  │  └─ nav.svg
│  ├─ background.webp
│  └─ favicon.svg
├─ client-modules/
│  ├─ clock/index.js
│  ├─ logs/index.js
│  ├─ navigation/index.js
│  ├─ preferences/index.js
│  └─ stopwatch/index.js
├─ server-modules/
│  ├─ config/index.js
│  ├─ logs/index.js
│  ├─ mime/index.js
│  ├─ paths/index.js
│  ├─ responses/index.js
│  ├─ router/index.js
│  ├─ server/index.js
│  └─ static/index.js
├─ stopwatch/
│  ├─ index.html
│  ├─ index.js
│  └─ style/main.css
├─ style/
│  ├─ body.css
│  ├─ main.css
│  └─ nav.css
├─ CONTRIBUTING.md
├─ Dockerfile
├─ README.md
├─ index.html
├─ index.js
├─ package-lock.json
├─ package.json
└─ router.js
```

## Docker

### Published images

Images are published to both registries:

- Docker Hub: [`amnoorbrar/digital-clock`](https://hub.docker.com/r/amnoorbrar/digital-clock)
- GitHub Container Registry: [`ghcr.io/amnoor/digital-clock`](https://github.com/Amnoor/Digital-Clock/pkgs/container/digital-clock)

Release tags such as `v1.0.4` and the rolling `latest` tag are published by the release workflow.

### Pull and run from Docker Hub

```bash
docker pull amnoorbrar/digital-clock:v1.0.4
docker run --rm --user 1000:1000 --read-only --cap-drop ALL -p 8080:80 --tmpfs /tmp:rw,noexec,nosuid,size=16m --name digital-clock-website amnoorbrar/digital-clock:v1.0.4
```

### Pull and run from GitHub Container Registry

```bash
docker pull ghcr.io/amnoor/digital-clock:v1.0.4
docker run --rm --user 1000:1000 --read-only --cap-drop ALL -p 8080:80 --tmpfs /tmp:rw,noexec,nosuid,size=16m --name digital-clock-website ghcr.io/amnoor/digital-clock:v1.0.4
```

### Run with runtime environment variables

```bash
docker run --rm --user 1000:1000 --read-only --cap-drop ALL -p 8080:80 -e PORT=80 -e DEBUG=true --tmpfs /tmp:rw,noexec,nosuid,size=16m --name digital-clock-website amnoorbrar/digital-clock:v1.0.4
```

Then open:

```text
http://localhost:8080/
http://localhost:8080/stopwatch/
```

### Build locally

```bash
docker build -t digital-clock:local .
docker run --rm --user 1000:1000 --read-only --cap-drop ALL -p 8080:80 --tmpfs /tmp:rw,noexec,nosuid,size=16m --name digital-clock-website digital-clock:local
```

## Release Workflow

The GitHub Actions workflow at `.github/workflows/docker-push.yml` runs when a tag matching `v*` is pushed.

Copy-paste release example:

```bash
git tag v1.0.4
git push origin v1.0.4
```

On tag push, the workflow:

- Builds multi-architecture images for `linux/amd64` and `linux/arm64`.
- Publishes the release tag and `latest` to Docker Hub and GHCR.
- Generates provenance and SBOM metadata during the image build.

## Logging and Debugging

- `error`, `warn`, and `info` logs are always emitted on both server and client.
- `log`, `debug`, and `trace` logs are enabled when `DEBUG=true`.
- The browser receives the debug flag through `/config.js`.
- `/config.js` is served with `Cache-Control: no-store` so browser-side debug state is not cached across environment changes.

## Security Notes

Static file responses include:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: no-referrer`

Other important runtime behavior:

- Missing assets and directory reads fall back to `404.html`.
- Permission-denied file reads return `403 Forbidden`.
- Unexpected filesystem read failures return `500`.
- Container run examples use a non-root user (`1000:1000`), `--read-only`, and `tmpfs` mounts for writable temporary paths.

## Contributing

See [`CONTRIBUTING.md`](/CONTRIBUTING.md) for development workflow, pull request structure, manual validation steps, and merge commit guidance.

## License

This project is licensed under the MIT License. See [`LICENSE`](/LICENSE) for details.
