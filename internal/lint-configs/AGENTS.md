# LINT CONFIGS

**Generated:** 2026-07-15

## OVERVIEW

Lint configuration packages for the entire monorepo. Dual-stage pipeline: oxlint (fast Rust) runs first with `--fix`, then ESLint (thorough). oxfmt replaces Prettier entirely.

## STRUCTURE

```
./
├── commitlint-config/   # Conventional commit rules
├── eslint-config/         # Full ESLint flat config (JS, TS, Vue, JSON, YAML)
├── oxlint-config/         # oxlint rules (correctness, suspicious, unicorn, TS)
├── oxfmt-config/          # Code formatter (Prettier replacement)
└── stylelint-config/      # CSS/SCSS/Vue style rules
```

## WHERE TO LOOK

| Config | File | Governs |
| --- | --- | --- |
| **oxfmt** | `oxfmt-config/src/index.ts` | `printWidth:80`, `singleQuote:true`, `semi:true`, `trailingComma:all`. JSON gets `trailingComma:none`. |
| **oxlint** | `oxlint-config/src/configs/*.ts` | `correctness=error`, `suspicious=warn`, unicorn, typescript, import, Vue, tailwindcss plugins. |
| **ESLint layering** | `eslint-config/src/custom-config.ts` | `no-restricted-imports`: `@core` cannot import `@vben/*`; `@core/base` cannot import any `@vben-core/*` or `@vben/*`; apps cannot use `#/api`, `#/layouts`, `#/locales`, `#/stores`. |
| **ESLint imports** | `eslint-config/src/configs/perfectionist.ts` | Import order: vue-type → vben-type → vben-core-type → vue → vben → vben-core → external → internal → side-effect. |
| **ESLint Vue** | `eslint-config/src/configs/vue.ts` | Macro order: `defineOptions` → `defineProps` → `defineEmits` → `defineSlots`. Block order: `script` → `template` → `style`. PascalCase components, camelCase props/events. |
| **stylelint** | `stylelint-config/index.mjs` | BEM-like `selector-class-pattern` with prefixes `c-`, `u-`, `is-`, `has-`, `js-`, `qa-`. SCSS + Tailwind at-rules allowed. |
| **commitlint** | `commitlint-config/index.mjs` | Angular types (`feat`, `fix`, `perf`, `style`, `docs`, `test`, `refactor`, `build`, `ci`, `chore`, `revert`, `types`, `release`). Header max 108 chars. Scopes auto-populated from workspace packages. |

## CONSUMPTION

All configs are private workspace packages (`@vben/*-config`). Consumed via `eslint.config.mjs`, `stylelint.config.mjs`, and `lefthook.yml` at repo root. Built with `tsdown` to `dist/` before use.
