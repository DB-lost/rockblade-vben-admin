# PROJECT KNOWLEDGE BASE

**Generated:** 2026-07-15 **Commit:** 99f1648c **Branch:** feature/v1.0.7/系统管理深入实现

## OVERVIEW

Vben-Admin v5.x monorepo — Vue 3 + Vite + TypeScript admin framework. RockBlade fork with Ant Design Vue Next (antdv-next). pnpm workspaces + Turborepo build orchestration.

## STRUCTURE

```
./
├── apps/
│   ├── web-antdv-next/    # Main admin SPA (Ant Design Vue Next)
│   └── backend-mock/      # Nitro mock API server
├── packages/
│   ├── @core/             # Foundation: base SDKs, UI kits, composables, preferences
│   │   ├── base/          # shared, typings, icons, design (no workspace deps)
│   │   ├── ui-kit/        # shadcn-ui, form-ui, menu-ui, popup-ui, layout-ui, tabs-ui
│   │   ├── composables/   # Low-level Vue composables
│   │   └── preferences/   # Core preference store
│   ├── effects/           # Stateful application features (Pinia, side effects)
│   │   ├── access/        layouts/     plugins/
│   │   ├── common-ui/     hooks/       request/
│   └── {constants,icons,locales,preferences,stores,styles,types,utils}/
├── internal/              # Build tooling (lint-configs, vite-config, tsconfig, tailwind-config, node-utils)
└── scripts/               # turbo-run, vsh, deploy
```

## WHERE TO LOOK

| Task | Location | Notes |
| --- | --- | --- |
| App entry / bootstrap | `apps/web-antdv-next/src/main.ts` → `bootstrap.ts` | Async pref init → lazy import bootstrap |
| Route definitions | `apps/web-antdv-next/src/router/routes/modules/` | Auto-loaded via `import.meta.glob` |
| Store definitions | `packages/stores/src/modules/` | Pinia with encrypted persistence |
| API calls | `apps/web-antdv-next/src/api/` | RequestClient from `@vben/request` |
| UI components | `packages/@core/ui-kit/shadcn-ui/src/ui/` | 253 base components |
| Business components | `packages/effects/common-ui/src/ui/` | Authentication, dashboard, profile |
| Layout system | `packages/effects/layouts/src/` | Basic layout, menu, tabs, preferences widgets |
| Form system | `packages/@core/ui-kit/form-ui/src/` | VeeValidate + Zod schema forms |
| i18n messages | `apps/web-antdv-next/src/locales/langs/` | en-US and zh-CN |
| Mock API endpoints | `apps/backend-mock/` | Nitro server, auto-start in dev |
| Build config | `internal/vite-config/src/` | Shared Vite config for all apps |
| Lint configs | `internal/lint-configs/` | ESLint, oxlint, stylelint, commitlint |
| Shared utils | `packages/@core/base/shared/src/utils/` | Color, date, diff, tree, cache, state |
| Vite plugins | `internal/vite-config/src/plugins/` | 11 plugins (nitro mock, archiver, inject-app-loading, etc.) |
| Plugin system | `packages/effects/plugins/src/` | ECharts, vxe-table, motion plugin wrappers |
| Core preferences | `packages/@core/preferences/src/` | PreferenceManager, CSS var updates, watchers |
| Node utilities | `internal/node-utils/src/` | fs, git, hash, monorepo, path, formatter |
| Scripts / CLI | `scripts/vsh/src/` | vsh CLI: lint, check-circular, check-dep, publint |

## CODE MAP

| Symbol | Type | Location | Role |
| --- | --- | --- | --- |
| `bootstrap()` | function | `apps/web-antdv-next/src/bootstrap.ts` | Vue app init (directives, i18n, stores, router) |
| `initStores()` | function | `packages/stores/src/setup.ts` | Pinia init with SecureLS persistence |
| `initPreferences()` | function | `packages/@core/preferences/src/` | User settings init (localStorage) |
| `generateAccess()` | function | `apps/web-antdv-next/src/router/access.ts` | Dynamic route gen from backend menus |
| `VbenForm` | component | `packages/@core/ui-kit/form-ui/src/` | Schema-driven form component |
| `useAccessStore` | store | `packages/stores/src/modules/access.ts` | Token, permissions, menus |
| `useUserStore` | store | `packages/stores/src/modules/user.ts` | User info, roles |
| `preferencesManager` | class | `packages/@core/preferences/src/` | PreferenceManager — init, update, reset, watchers |
| `usePreferences` | composable | `packages/@core/preferences/src/use-preferences.ts` | Reactive preference access in components |
| `useTabbarStore` | store | `packages/stores/src/modules/tabbar.ts` | Tab lifecycle, caching, visit history |
| `useTimezoneStore` | store | `packages/stores/src/modules/timezone.ts` | Timezone with custom handler injection |
| `RequestClient` | class | `packages/effects/request/src/request-client/` | Axios wrapper, uploader, downloader, SSE |
| `Vsh CLI` | tool | `scripts/vsh/src/` | 5 commands: lint, check-circular, check-dep, publint, code-workspace |

## CONVENTIONS

- **Import architecture**: `@vben-core/*` → no workspace deps (pure foundation). `@vben/*` → wraps `@vben-core/*`. `@vben/effects/*` → combines multiple `@vben/*` with Pinia. Apps → can use all.
- **ESLint enforces layering**: `@core` cannot import `@vben/*`. `@core/base` cannot import any `@vben-core/*` or `@vben/*` package. Apps/effects cannot import `#/api`, `#/layouts`, `#/locales`, `#/stores` (use `@core` packages).
- **Component naming**: PascalCase templates, hyphenated attributes, self-closing void components
- **Vue macros order**: `defineOptions` → `defineProps` → `defineEmits` → `defineSlots`
- **Import order**: vue-type → vben-type → vben-core-type → vben → vben-core (enforced by Perfectionist)
- **CSS classes**: BEM-like with prefixes (`c-`, `u-`, `is-`, `has-`, `js-`, `qa-`)
- **Commit format**: `type(scope): description` — types: feat,fix,perf,style,docs,test,refactor,build,ci,chore,revert,types,release,workflow — max 108 chars header
- **pnpm catalog versioning**: All deps managed via `pnpm-workspace.yaml` catalog

## ANTI-PATTERNS (THIS PROJECT)

- **DO NOT** use `#/api`, `#/layouts`, `#/locales`, `#/stores` imports in `@core` or `effects` packages — use `@vben-core/*` re-exports
- **DO NOT** add workspace deps to `@vben-core/*` packages — they must remain framework-agnostic
- **DO NOT** commit with `--no-verify` — lefthook runs oxlint+oxfmt+eslint+stylelint
- **DO NOT** store secrets in `backend-mock/utils/jwt-utils.ts` — `TODO: Replace with your own secret key`
- **DO NOT** skip typecheck — `noUncheckedIndexedAccess: true` means array indices return `T | undefined`
- **`onFinished`/`onStarted`** events in `count-to-animator.vue` are deprecated — use `finished`/`started`
- **DO NOT** hardcode `apiURL` — use `useAppConfig(import.meta.env, import.meta.env.PROD)`
- **DO NOT** add business logic to layout widgets — keep them presentational
- **DO NOT** mutate `formApi.state` directly — use `formApi.setState()` or `Store` methods
- **DO NOT** call `useAuthStore` outside Pinia setup or component scope
- **DO NOT** import full `ant-design-vue` — use `antdv-next` subpath imports only

## UNIQUE STYLES

- **Dual-stage linting**: oxlint (fast Rust linter) runs first with `--fix`, then eslint (thorough)
- **Lefthook** (not Husky) for git hooks — parallel pre-commit checks via `pnpm vsh`
- **Turbo interactive runner**: `pnpm dev` launches TUI package selector (`scripts/turbo-run/`)
- **Vsh CLI**: Custom tool wrapping circular-dep-scan, depcheck, publint (`scripts/vsh/`)
- **Encrypted store storage**: Pinia persistedstate uses SecureLS (AES) in production
- **Two-tier package naming**: `@vben-core/*` (npm-publishable foundation) vs `@vben/*` (monorepo internal)

## COMMANDS

```bash
pnpm dev                    # Interactive turbo package selector
pnpm build                  # Full monorepo build (8GB heap via NODE_OPTIONS)
pnpm build:antd             # Build only web-antdv-next
pnpm build:docker           # Build local Docker image (scripts/deploy/build-local-docker-image.sh)
pnpm lint                   # Run all linters (oxfmt + oxlint + eslint + stylelint via vsh)
pnpm format                 # Auto-fix all lint issues
pnpm check                  # Full suite: circular-deps + depcheck + typecheck + cspell
pnpm check:type             # TypeScript typecheck (all workspaces)
pnpm check:circular         # Circular dependency scan
pnpm check:dep              # Unused dependency check
pnpm test:unit              # Vitest unit tests (with happy-dom)
pnpm test:e2e               # Playwright E2E tests (via turbo)
pnpm commit                 # Interactive commit (czg)
pnpm changeset              # Create changeset for versioning
pnpm publint                # Package publishing standards check
pnpm preview                # Preview built apps (turbo-run)
```

## NOTES

- `pnpm-workspace.yaml` references `packages/business/*`, `docs/`, `playground/` but these don't exist on disk
- Mock backend auto-starts during dev via Vite plugin — no manual startup needed
- App namespace for storage: `{VITE_APP_NAMESPACE}-{VITE_APP_VERSION}-{env}`
- `apps/backend-mock/` hardcodes JWT secrets — replace before production use
- `apps/web-antdv-next/.env` has `VITE_APP_STORE_SECURE_KEY=please-replace-me-with-your-own-key`
- `packages/business/*`, `packages/@core/forward/*`, `docs/`, `playground/` referenced in `pnpm-workspace.yaml` but don't exist on disk
- E2E infrastructure installed (Playwright + turbo task) but no E2E specs written yet
- No test coverage thresholds configured — CI runs tests but doesn't enforce coverage
