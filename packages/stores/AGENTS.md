# AGENTS.md — @vben/stores

## OVERVIEW

Pinia stores package for the Vben Admin business layer, re-exporting `defineStore` and `storeToRefs` plus four domain-specific store modules with encrypted persistence.

## STRUCTURE

```
src/
├── index.ts          # Re-exports defineStore, storeToRefs, modules, setup
├── setup.ts          # initStores(app, options) — Pinia creation + persistedstate plugin
└── modules/
    ├── access.ts     # useAccessStore — tokens, codes, menus, routes, lock screen
    ├── user.ts       # useUserStore — userInfo, userRoles
    ├── tabbar.ts     # useTabbarStore — tab lifecycle, caching, visit history
    └── timezone.ts   # useTimezoneStore — timezone ref with custom handler injection
```

## WHERE TO LOOK

| Symbol | Location | Role |
| --- | --- | --- |
| `initStores` | `src/setup.ts` | Creates Pinia, wires `pinia-plugin-persistedstate` with namespace-scoped SecureLS |
| `useAccessStore` | `src/modules/access.ts` | accessToken, refreshToken, accessCodes, accessMenus, isAccessChecked, loginExpired, lockScreen |
| `useUserStore` | `src/modules/user.ts` | userInfo, userRoles; setUserInfo syncs roles automatically |
| `useTabbarStore` | `src/modules/tabbar.ts` | Tabs, affix, cache, close left/right/other/all, visit history stack |
| `useTimezoneStore` | `src/modules/timezone.ts` | timezone ref; supports custom handler via `setTimezoneHandler` |
| `resetAllStores` | `src/setup.ts` | Iterates `_s` map and calls `$reset` on every store instance |

## CONVENTIONS

- Store IDs use `core-` prefix: `core-access`, `core-user`, `core-tabbar`, `core-timezone`.
- `initStores` requires a `namespace` string to isolate localStorage keys per app.
- Persistence key format: `{namespace}-{store.id}`.
- SecureLS encrypts with AES in production; dev falls back to plain localStorage.
- `accessStore` persists token, codes, and lock state. `tabbarStore` persists tabs and visit history to sessionStorage.
- `timezoneStore` auto-initializes on import and calls `setCurrentTimezone` for dayjs.
- Every store accepts HMR via `acceptHMRUpdate`.

## ANTI-PATTERNS

- DO NOT import `@vben/stores` from `@vben-core/*` packages. Core packages must remain store-agnostic.
- DO NOT add non-serializable state to persisted stores without a custom serializer.
- DO NOT call `pinia.use` outside `initStores`. Plugin setup is centralized in setup.ts.
- DO NOT forget that `resetAllStores` relies on Pinia internal `_s`. It skips stores not yet instantiated.
- DO NOT use `storeToRefs` on actions. Only state and getters are refs.
