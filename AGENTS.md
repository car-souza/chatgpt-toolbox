# Repository Guidelines

## Project Structure & Module Organization
This project is a Next.js 14 + TypeScript app using the App Router.

- `app/`: Route pages, API handlers, and UI components.
- `app/tool/[direction]/page.tsx`: Dynamic route for shareable prompt-driven tools.
- `app/chat/page.tsx`: Conversation UI.
- `app/api/chat/route.ts`: Server route wrapper for chat completion requests.
- `app/components/`: Reusable UI pieces (`ChatBox`, `Markdown`, `CodeBlock`).
- `utils/`: API clients and helpers (`gptClient.ts`, `liveGptClient.ts`, `config.ts`).
- `types/`: Shared type declarations.
- `public/`: Static assets.

## Build, Test, and Development Commands
Use Yarn (lockfile is committed as `yarn.lock`).

- `yarn dev`: Start local dev server at `http://localhost:3000`.
- `yarn build`: Create a production build.
- `yarn start`: Run the production build locally.
- `yarn lint`: Run ESLint with `next/core-web-vitals` rules.

## Coding Style & Naming Conventions
- Language: TypeScript (`strict` mode enabled in `tsconfig.json`).
- Indentation: 2 spaces; keep diffs small and focused.
- Components: `PascalCase` file and export names (`ChatBox.tsx`).
- Variables/functions: `camelCase`; constants: `UPPER_SNAKE_CASE`.
- Routes follow Next.js App Router conventions (`app/<segment>/page.tsx`).
- Prefer imports via alias: `@/utils/...`, `@/app/...`.

## Testing Guidelines
There is currently no dedicated automated test framework configured.

Current minimum validation for every change:
- Run `yarn lint`.
- Manually verify key flows in `/`, `/tool/[direction]`, and `/chat`.
- For logic-heavy additions in `utils/`, add deterministic tests when introducing a test runner (recommended naming: `*.test.ts`).

## Commit & Pull Request Guidelines
Commit history favors short, imperative messages, with recent Conventional Commit prefixes.

- Prefer format: `feat: ...`, `fix: ...`, `refactor: ...`, `chore: ...`.
- Keep commits atomic (no unrelated formatting or renames).
- PRs should include: intent, user-visible changes, manual test steps, and linked issue (if applicable).
- Include screenshots/GIFs for UI changes.

## Security & Configuration Tips
- Do not commit real API keys.
- Use `NEXT_PUBLIC_OPENAI_URL` and `OPENAI_API_KEY` via environment variables when needed.
- Treat `localStorage` API key usage as sensitive during demos and screen recordings.
