# Electra's TasteCode changes

This branch (`electra/auto-isolate` in `electra-usa/leon-visual-design-tastecode`) is Leon's
TasteCode plus the changes below. Leon's code stays untouched elsewhere; his updates are pulled
in by merging his branch into this one.

## Changes

### 1. Auto-isolate (2026-11-17)

- **What:** when a chat is already working in a project, a new chat in that project starts
  Isolated by itself (its own copy of the project), and says so.
- **Why:** two AIs editing the same files at once overwrite each other.
- **Where:** `apps/web/src/App.tsx` (`sharedCheckoutBusy`).
- **Limits:** only while the other chat is actively working, and only in Git projects.

### 2. Set up Git from inside TasteCode (2026-11-17)

- **What:** in a project without Git, the Local/Isolated menu under the message box offers
  **Set up Git**. It runs `git init` (branch `main`), adds a starter `.gitignore` if the folder
  has none (skips `node_modules/` and `.env` files), and saves a "Starting point" commit.
- **Why:** so a project can be set up without leaving TasteCode for VS Code or a terminal.
- **Where:** `apps/server/src/workspace-git.ts` (`initCheckout`), new `workspace.initGit`
  method in `packages/contracts/src/protocol.ts` and `apps/server/src/server.ts`, menu item in
  `apps/web/src/ui/Composer.tsx`. Tests: `apps/server/src/workspace-init.test.ts`.
- **Limits:** refuses a folder that already uses Git.

### 3. Getting started guide (2026-11-17)

- **What:** a small panel in the bottom-right corner that walks through the first steps
  (sign in, open a project folder, set up Git, pick a model, Local vs Isolated, Design mode,
  review, undo). Shows on first launch; × hides it; **⋯ > Getting started guide** brings it
  back.
- **Where:** `apps/web/src/ui/GettingStarted.tsx`, `apps/web/src/styles/getting-started.css`,
  wiring in `App.tsx` and `ui/StageHeader.tsx`. The hidden choice is stored in the app's local
  storage (`electra.gettingStartedHidden`).

## Building and installing

From the repo folder, with Node 24 and pnpm (via `corepack pnpm`):

```text
corepack pnpm install --frozen-lockfile
corepack pnpm --filter @harness/desktop dist
```

The installer lands in `release\TasteCode-<version>-win-x64.exe`. Close TasteCode, then run it
(or run it with `/S` for a silent per-user install).

## Getting Leon's updates

```text
git fetch upstream
git merge upstream/dev
```

This branch started from Leon's `dev` branch (his newest work, v0.5.1 at the time), so updates
come from `upstream/dev`.

Resolve any conflicts, rerun the tests (`corepack pnpm test`), rebuild and reinstall. Never
rebase or force-push this branch.
