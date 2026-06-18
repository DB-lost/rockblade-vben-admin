# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev                          # Interactive package selector → launches dev server
pnpm build                        # Full monorepo build (8GB heap via NODE_OPTIONS)
pnpm build:antd                   # Build only web-antdv-next app
pnpm lint                         # Run all linters (oxlint + eslint + stylelint)
pnpm format                       # Auto-fix all lint issues
pnpm check                        # Full check suite: circular-deps + depcheck + typecheck + cspell
pnpm check:type                   # TypeScript typecheck across all workspaces
pnpm check:circular               # Circular dependency scan
pnpm test:unit                    # Vitest unit tests (with happy-dom)
pnpm test:e2e                     # Playwright E2E tests (via turbo)
pnpm commit                       # Interactive commit via czg
pnpm changeset                    # Create changeset for versioning
```

## Architecture

**Monorepo** — pnpm workspaces + Turborepo build orchestration. Deps managed via `pnpm-workspace.yaml` catalog.

```
apps/
  web-antdv-next/          # Main admin SPA (Ant Design Vue Next)
  backend-mock/            # Nitro mock API server (auto-starts in dev via Vite plugin)
packages/
  @core/
    base/shared/           # Framework-agnostic utils (color, date, diff, tree, cache, state)
    base/typings/          # Shared TS types
    base/icons/            # Icon definitions
    base/design/           # Design tokens
    ui-kit/shadcn-ui/      # 253 base UI components (Button, Input, Modal, Drawer, etc.)
    ui-kit/form-ui/        # VeeValidate + Zod schema-driven form component
    ui-kit/layout-ui/      # Layout system components
    ui-kit/menu-ui/        # Navigation menu components
    ui-kit/popup-ui/       # Popup/modal components
    ui-kit/tabs-ui/        # Tab components
    composables/           # Low-level Vue composables
    preferences/           # Core preference store (localStorage-based user settings)
  effects/
    access/                # Permission/role-based access control
    common-ui/             # Business components (auth, dashboard, profile)
    layouts/               # Full layout system (BasicLayout, menu, tabs, preference widgets)
    hooks/                 # Shared Vue hooks
    plugins/               # Vue plugins
    request/               # Axios wrapper (RequestClient) with auth interceptors
  constants/               # App constants
  icons/                   # Icon system
  locales/                 # i18n definitions
  preferences/             # User preference types
  stores/                  # Pinia stores with SecureLS-encrypted persistence
  styles/                  # Global styles
  types/                   # Cross-package types
  utils/                   # Shared utility functions
internal/                  # Build tooling (vite-config, tsconfig, lint-configs, node-utils, tailwind-config)
scripts/                   # turbo-run, vsh CLI, deploy scripts
```

## Import Architecture (Layering Rules)

- `@vben-core/*` → NO workspace deps (pure foundation, framework-agnostic)
- `@vben/*` → wraps `@vben-core/*` (adds Vue reactivity)
- `@vben/effects/*` → combines multiple `@vben/*` with Pinia
- Apps (`#/*`) → can use everything; imports `#/api`, `#/layouts`, `#/locales`, `#/stores` from app-layer aliases
- ESLint enforces: `@core` cannot import `@vben/*`; `@core/base` cannot import any `@vben-core/*` or `@vben/*`

## Key Patterns

### App Entry Flow

`main.ts` → `bootstrap.ts`: initComponentAdapter → initSetupVbenForm → createApp → registerAccessDirective → registerLoadingDirective → setupI18n → initStores (Pinia) → router → app.mount

### Dynamic Route Generation

Backend menus fetched via `getAllMenusApi` → `generateAccessible()` maps to `import.meta.glob('../views/**/*.vue')` → routes generated with layout/page components from `layoutMap`/`pageMap`. See `router/access.ts`.

### API Layer

All API calls in `src/api/` organized by domain (`system/`, `infra/`, `core/`). Uses `RequestClient` from `@vben/effects/request` via `#/api/request`. Pattern:

```typescript
import { requestClient } from '#/api/request';
const Api = { Base: '/resource-name' };
export async function listResource() {
  return requestClient.get(Api.Base);
}
export async function saveResource(data: ReqType) {
  return requestClient.post(Api.Base, data);
}
```

### View Pattern (VxeTable Grid)

Each CRUD view follows: `index.vue` (grid setup) → `modules/form.vue` (drawer form) → `data.ts` (columns + form schema). Uses:

- `useVbenVxeGrid` for table with proxy config (ajax.query, response mapping)
- `useVbenDrawer` for form drawers
- Client-side filtering when server doesn't support it
- Action column with dropdown menu for edit/delete/status toggle

### Form System

VeeValidate + Zod schema-driven forms via `VbenForm` component. Schemas defined with field definitions (component type, rules, dependencies).

### Store Pattern

Pinia stores with `pinia-plugin-persistedstate` (SecureLS encryption in production). Stores in `packages/stores/src/modules/`. Key stores: `useAccessStore` (token, permissions, menus), `useUserStore` (user info, roles).

### Adapter Layer

`src/adapter/component/index.ts` swaps UI library components. Currently adapted for Ant Design Vue Next (`antdv-next`). This allows the core packages to remain UI-agnostic.

### Vite Config

Main app `vite.config.ts` proxies `/api` → backend (mock at `localhost:5320` or real at `localhost:8080/rock-blade/admin`). Controlled by `VITE_NITRO_MOCK` env var.

## Conventions

- **Vue SFC**: `<script lang="ts" setup>` → template → scoped styles. Macros order: `defineOptions` → `defineProps` → `defineEmits` → `defineSlots`
- **Component naming**: PascalCase templates, hyphenated attributes, self-closing void elements
- **CSS**: Tailwind CSS v4 + custom BEM-like prefixes (`c-`, `u-`, `is-`, `has-`, `js-`, `qa-`)
- **Import order**: vue → @vben-core/types → @vben/types → @vben → @vben-core → #/ (enforced by Perfectionist)
- **Git commits**: `type(scope): description` — max 108 chars. Types: feat,fix,perf,style,docs,test,refactor,build,ci,chore,revert,types,release,workflow
- **Pre-commit hooks**: lefthook runs oxfmt + oxlint --fix + eslint --fix + stylelint in parallel on staged files
- **TypeScript**: `noUncheckedIndexedAccess: true` — array indices return `T | undefined`
- **Package naming**: `@vben-core/*` (npm-publishable foundation) vs `@vben/*` (monorepo internal packages)
- **i18n**: Vue I18n with en-US + zh-CN. Use `$t()` from `#/locales` in views. Messages at `src/locales/langs/`
- **Storage namespace**: `{VITE_APP_NAMESPACE}-{VITE_APP_VERSION}-{env}`

## Anti-Patterns / Gotchas

- DO NOT use `#/api`, `#/layouts`, `#/locales`, `#/stores` imports in `@core` or `effects` packages — use `@vben-core/*` re-exports
- DO NOT add workspace deps to `@vben-core/*` packages — they must remain framework-agnostic
- DO NOT skip typecheck — `noUncheckedIndexedAccess: true` catches real bugs
- `packages/effects/hooks/src/use-count-to/count-to-animator.vue`: `onFinished`/`onStarted` events are deprecated — use `finished`/`started`
- `apps/backend-mock/` hardcodes JWT secrets in `utils/jwt-utils.ts` — replace before production
- Mock backend auto-starts during dev — no manual startup needed

## Key Config Files

| File | Purpose |
| --- | --- |
| `pnpm-workspace.yaml` | Workspace definitions + dependency catalog |
| `turbo.json` | Turborepo task pipeline |
| `lefthook.yml` | Git hooks (pre-commit lint + commit-msg check) |
| `apps/web-antdv-next/vite.config.ts` | App build config + API proxy |
| `apps/web-antdv-next/.env.*` | Environment variables |
| `internal/vite-config/src/` | Shared Vite config for all apps |
| `internal/lint-configs/` | ESLint, oxlint, stylelint, commitlint configs |
