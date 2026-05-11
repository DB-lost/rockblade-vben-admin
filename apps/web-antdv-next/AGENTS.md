# APP KNOWLEDGE BASE

## OVERVIEW
Main admin SPA. Package `@vben/web-antdv-next` v5.7.0. Ant Design Vue Next (antdv-next) UI layer.

## STRUCTURE
```
src/
├── main.ts              # Entry: compute namespace, initPreferences, lazy bootstrap
├── bootstrap.ts         # createApp, directives, i18n, stores, router, mount
├── adapter/
│   ├── component/index.ts   # ~30 Antd components registered to globalShareState
│   └── form.ts          # VbenForm v-model mapping (value/checked/fileList)
├── api/
│   ├── request.ts       # RequestClient with auth interceptors + 401 refresh
│   ├── core/            # Auth, common, menu endpoints
│   ├── system/          # Dept, menu, role endpoints
│   └── infra/           # Codegen endpoints
├── locales/
│   ├── index.ts         # setupI18n, load antd + dayjs locale bundles
│   └── langs/           # en-US, zh-CN JSON files
├── router/
│   ├── index.ts         # Hash or web history, scrollBehavior
│   ├── guard.ts         # Common guard + access guard
│   ├── access.ts        # Dynamic route generation from backend menus
│   └── routes/
│       └── modules/     # Auto-loaded: import.meta.glob('./modules/**/*.ts')
├── store/
│   └── auth.ts          # Login (RSA encrypt), logout, fetchUserInfo
├── preferences.ts       # Overrides: VITE_APP_TITLE, logo.svg, theme auto, RockBlade 2026
└── vite.config.ts       # Proxy /api -> localhost:5320 (mock) or localhost:8080/rock-blade/admin
```

## BOOTSTRAP FLOW
`main.ts` -> `initPreferences(namespace, overrides)` -> lazy import `bootstrap.ts` -> `createApp(App)` -> `registerLoadingDirective` -> `setupI18n` -> `initStores` -> `registerAccessDirective` -> `app.use(router)` -> `MotionPlugin` -> `app.mount('#app')`

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Auth flow | `src/store/auth.ts` | RSA-encrypted login, token refresh, redirect on logout |
| API client | `src/api/request.ts` | Bearer token header, 401 auto-refresh, error message mapping |
| Component adapter | `src/adapter/component/index.ts` | Async Antd imports, globalShareState registration |
| Form setup | `src/adapter/form.ts` | baseModelPropName: 'value', modelPropNameMap for Checkbox/Radio/Switch/Upload |
| Route guards | `src/router/guard.ts` | Progress bar + access control with dynamic route generation |
| Dynamic routes | `src/router/routes/modules/` | Flat .ts files, auto-globbed |
| i18n + locale bundles | `src/locales/` | Antd and dayjs locale switching per language |
| App preferences | `src/preferences.ts` | Overrides defaults before bootstrap |

## CONVENTIONS
- Import Antd components from `antdv-next/dist/<name>/index` for tree-shaking
- Use `defineAsyncComponent` for all Antd component imports in adapter
- API functions live in `src/api/` grouped by domain (`core/`, `system/`, `infra/`)
- Auth store uses `cryptoUtil` (RSA) before calling `loginApi`
- Locale files: `langs/<lang>/<module>.json`, loaded via `import.meta.glob`
- Proxy target switches on `VITE_NITRO_MOCK`

## ANTI-PATTERNS
- DO NOT import full `ant-design-vue` — use `antdv-next` subpath imports only
- DO NOT skip `initComponentAdapter()` before mounting; forms and modals depend on globalShareState
- DO NOT hardcode `apiURL` — read from `useAppConfig(import.meta.env, import.meta.env.PROD)`
- DO NOT call `useAuthStore` outside Pinia setup or component scope
- DO NOT forget `loadThirdPartyMessage` when adding a new language; antd and dayjs must stay in sync
