# PROJECT KNOWLEDGE BASE

**Generated:** 2026-05-11
**Commit:** 318223d1
**Branch:** release/v1.0.1

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
|------|----------|-------|
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

## CODE MAP
| Symbol | Type | Location | Role |
|--------|------|----------|------|
| `bootstrap()` | function | `apps/web-antdv-next/src/bootstrap.ts` | Vue app init (directives, i18n, stores, router) |
| `initStores()` | function | `packages/stores/src/setup.ts` | Pinia init with SecureLS persistence |
| `initPreferences()` | function | `packages/@core/preferences/src/` | User settings init (localStorage) |
| `generateAccess()` | function | `apps/web-antdv-next/src/router/access.ts` | Dynamic route gen from backend menus |
| `RequestClient` | class | `packages/effects/request/src/` | Axios wrapper with auth interceptors |
| `VbenForm` | component | `packages/@core/ui-kit/form-ui/src/` | Schema-driven form component |
| `useAccessStore` | store | `packages/stores/src/modules/access.ts` | Token, permissions, menus |
| `useUserStore` | store | `packages/stores/src/modules/user.ts` | User info, roles |

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
pnpm build                  # Full monorepo build (8GB heap)
pnpm build:antd             # Build only web-antdv-next
pnpm lint                   # Run all linters (via vsh)
pnpm check:type             # TypeScript typecheck (all workspaces)
pnpm check:circular         # Circular dependency scan
pnpm test:unit              # Vitest unit tests (with DOM)
pnpm commit                 # Interactive commit (czg)
pnpm changeset              # Create changeset for versioning
```

## NOTES
- `pnpm-workspace.yaml` references `packages/business/*`, `docs/`, `playground/` but these don't exist on disk
- Mock backend auto-starts during dev via Vite plugin — no manual startup needed
- App namespace for storage: `{VITE_APP_NAMESPACE}-{VITE_APP_VERSION}-{env}`
- `apps/backend-mock/` hardcodes JWT secrets — replace before production use
