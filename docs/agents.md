# MyProject

This is an overview of My Project. It's an example app used to highlight AGENTS.md files utility.

## Core Commands

• Type-check and lint: `pnpm check`
• Auto-fix style: `pnpm check:fix`
• Run full test suite: `pnpm test --run --no-color`
• Run a single test file: `pnpm test --run <path>.test.ts`
• Start dev servers (frontend + backend): `pnpm dev`
• Build for production: `pnpm build` then `pnpm preview`

All other scripts wrap these six tasks.

## Project Layout

├─ client/ → React + Vite frontend
├─ server/ → Express backend

• Frontend code lives **only** in `client/`
• Backend code lives **only** in `server/`
• Shared, environment-agnostic helpers belong in `src/`

## Development Patterns & Constraints

Coding style
• TypeScript strict mode, single quotes, trailing commas, no semicolons.
• 100-char line limit, tabs for indent (2-space YAML/JSON/MD).
• Use interfaces for public APIs; avoid `@ts-ignore`.
• Tests first when fixing logic bugs.
• Visual diff loop for UI tweaks.
• Never introduce new runtime deps without explanation in PR description.

## Git Workflow Essentials

1. Branch from `main` with a descriptive name: `feature/<slug>` or `bugfix/<slug>`.
2. Run `pnpm check` locally **before** committing.
3. Force pushes **allowed only** on your feature branch using
   `git push --force-with-lease`. Never force-push `main`.
4. Keep commits atomic; prefer checkpoints (`feat: …`, `test: …`).

## Evidence Required for Every PR

A pull request is reviewable when it includes:

- All tests green (`pnpm test`)
- Lint & type check pass (`pnpm check`)
- Diff confined to agreed paths (see section 2)
- **Proof artifact**
  • Bug fix → failing test added first, now passes
  • Feature → new tests or visual snapshot demonstrating behavior
- One-paragraph commit / PR description covering intent & root cause
- No drop in coverage, no unexplained runtime deps