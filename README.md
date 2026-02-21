# Digital Clock

A sleek, blazing-fast digital clock with a built-in stopwatch — simple on the surface, thoughtfully engineered underneath.

## Table Of Contents

- [Digital Clock](#digital-clock)
  - [Overview](#overview)
  - [Features](#features)
  - [Quick Start](#quick-start)
    - [Prerequisites](#prerequisites)
    - [1. Clone and install](#1-clone-and-install)
    - [2. Run in development mode](#2-run-in-development-mode)
    - [3. Run in production mode](#3-run-in-production-mode)
    - [4. Open in browser](#4-open-in-browser)
  - [Runtime Configuration](#runtime-configuration)
    - [PowerShell example](#powershell-example)
    - [macOS/Linux example](#macoslinux-example)
  - [Routes](#routes)
  - [Architecture](#architecture)
    - [Server-side modules](#server-side-modules)
    - [Client-side modules](#client-side-modules)
    - [Request flow (high level)](#request-flow-high-level)
  - [Repository Structure](#repository-structure)
  - [Docker](#docker)
    - [Pull and run from Docker Hub](#pull-and-run-from-docker-hub)
    - [Pull and run from GitHub Container Registry](#pull-and-run-from-github-container-registry)
    - [Run with runtime env vars](#run-with-runtime-env-vars)
    - [Build locally](#build-locally)
    - [Access the Website](#access-the-website)
  - [Release Workflow](#release-workflow)
  - [Logging and Debugging](#logging-and-debugging)
  - [Security Notes](#security-notes)
  - [Contributing](#contributing)
  - [License](#license)

## Overview

Digital Clock is a minimalist web application with two core experiences:

- A live digital clock with a 12-hour/24-hour toggle.
- A stopwatch with start, stop, and reset controls.

The project uses a modular Node.js HTTP server (no framework) and modular browser-side JavaScript.

## Features

- Real-time digital clock display.
- 12h/24h format switch with persistence through `localStorage` (`clockMode`).
- Stopwatch powered by `performance.now()` + `requestAnimationFrame` for monotonic elapsed timing.
- Responsive navigation for desktop and mobile.
- Dynamic runtime config endpoint at `/config.js` for browser debug behavior.
- Static file server with custom 404 handling.
- Containerized runtime with a hardened multi-stage `Dockerfile`.
- Automated multi-arch image publishing to Docker Hub and GHCR on version tags.

## Quick Start

### Prerequisites

- Node.js 24.13.1 (LTS)
- npm

### 1. Clone and install

```bash
git clone git@github.com:Amnoor/Digital-Clock.git
cd Digital-Clock
npm ci
```

### 2. Run in development mode

```env
PORT=5500
DEBUG=true
```

```bash
npm run dev
```

### 3. Run in production mode

```bash
npm start
```

### 4. Open in browser

```text
http://localhost:80/
http://localhost:80/stopwatch/
```

If you set a custom `PORT`, use that port instead.

## Runtime Configuration

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `PORT` | No | `80` | HTTP port for the Node server. |
| `DEBUG` | No | `false` | Enables non-essential log levels (`debug`, `trace`, `log`). |

### PowerShell example

```env
PORT=5500
DEBUG=true
```

```powershell
npm run dev
```

### macOS/Linux example

```env
PORT=5500
DEBUG=true
```

```bash
npm run dev
```

## Routes

| Route | Method | Behavior |
| --- | --- | --- |
| `/` | GET | Serves `index.html` (clock page). |
| `/stopwatch` | GET | 301 redirect to `/stopwatch/`. |
| `/stopwatch/` | GET | Serves `stopwatch/index.html`. |
| `/config.js` | GET | Serves dynamic config script with `window.APP_CONFIG.DEBUG`. |
| `/*` | GET | Serves static assets; returns custom 404 page if missing. |

## Architecture

### Server-side modules

- `server-modules/server/`: HTTP server bootstrap and port binding.
- `server-modules/router/`: request flow orchestration.
- `server-modules/paths/`: URL parsing and project root resolution.
- `server-modules/static/`: static path resolution, file serving, stopwatch redirect.
- `server-modules/config/`: dynamic `/config.js` generation.
- `server-modules/responses/`: shared response helpers (404/500/redirect).
- `server-modules/mime/`: MIME type mapping.
- `server-modules/logs/`: server logger with debug gating.

### Client-side modules

- `client-modules/clock/`: live clock updates and formatting.
- `client-modules/preferences/`: load/save mode preferences and toggle listeners.
- `client-modules/stopwatch/`: stopwatch state and control logic.
- `client-modules/navigation/`: mobile menu behavior and ARIA state updates.
- `client-modules/logs/`: browser logger with debug gating.

### Request flow (high level)

1. `router.js` initializes logger, creates a request handler, and starts the server.
2. Router parses the request URL and checks special handlers (`/config.js`, `/stopwatch`).
3. Static resolver maps path to file path and returns the content with security headers.
4. Missing assets return `404.html`; unexpected failures return a 500 response.

## Repository Structure

```text
Digital-Clock/
├─ assets/
│  ├─ Mobile/nav.svg
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
├─ .github/workflows/docker-push.yml
├─ Dockerfile
├─ index.html
├─ index.js
├─ router.js
└─ package.json
```

## Docker

Your images are published to:

- Docker Hub: [`amnoorbrar/digital-clock`](https://hub.docker.com/r/amnoorbrar/digital-clock)
- GHCR: [`ghcr.io/amnoor/digital-clock`](https://github.com/Amnoor/Digital-Clock/pkgs/container/digital-clock)

### Pull and run from Docker Hub

```bash
docker pull amnoorbrar/digital-clock:latest
docker run --rm --user 1000:1000 --read-only --cap-drop ALL -p 8080:80 --tmpfs /tmp:rw,noexec,nosuid,size=16m --tmpfs /var/tmp:rw,noexec,nosuid,size=16m --name digital-clock-website amnoorbrar/digital-clock:latest
```

### Pull and run from GitHub Container Registry

```bash
docker pull ghcr.io/amnoor/digital-clock:latest
docker run --rm --user 1000:1000 --read-only --cap-drop ALL -p 8080:80 --tmpfs /tmp:rw,noexec,nosuid,size=16m --tmpfs /var/tmp:rw,noexec,nosuid,size=16m --name digital-clock-website ghcr.io/amnoorbrar/digital-clock:latest
```

### Run with runtime env vars

```bash
docker run --rm --user 1000:1000 --read-only --cap-drop ALL -p 8080:80 -e PORT=80 -e DEBUG=true --tmpfs /tmp:rw,noexec,nosuid,size=16m --tmpfs /var/tmp:rw,noexec,nosuid,size=16m --name digital-clock-website amnoorbrar/digital-clock:latest
```

### Build locally

```bash
docker build -t digital-clock:local .
docker run --rm --user 1000:1000 --read-only --cap-drop ALL -p 8080:80 --tmpfs /tmp:rw,noexec,nosuid,size=16m --tmpfs /var/tmp:rw,noexec,nosuid,size=16m --name digital-clock-website amnoorbrar/digital-clock:local
```

### Access the Website

Open the Website Home page at [`localhost:8080`](http://localhost:8080/) and the the Stopwatch Page at [`localhost:8080`](http://localhost:8080/stopwatch)

## Release Workflow

The GitHub Actions workflow at `.github/workflows/docker-push.yml` runs on pushes to tags matching `v*`.

For example: `v1.0.0` or `v1.2.3`

On tag push, the workflow builds and publishes multi-architecture images (`linux/amd64`, `linux/arm64`) to Docker Hub and GHCR and generates provenance/SBOM metadata.

## Logging and Debugging

- Production-friendly logs are always emitted for `error`, `warn`, and `info` levels.
- Verbose logs (`debug`, `trace`, `log`) are emitted when `DEBUG=true`.
- Browser runtime receives debug state through `/config.js`.

## Security Notes

Static file responses include:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: no-referrer`

## Contributing

See [`CONTRIBUTING.md`](/CONTRIBUTING.md) for branch, commit, PR, and review requirements.

## License

This project is licensed under the MIT License. See [`LICENSE`](/LICENSE) for details.