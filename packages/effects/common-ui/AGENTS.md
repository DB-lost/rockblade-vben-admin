## OVERVIEW

@vben/common-ui effects package. Re-exports and extends @vben-core/form-ui, popup-ui, shadcn-ui with business components (~87 files).

## STRUCTURE

```
src/
├── components/          # Utility components (14 dirs)
│   ├── api-component/   # API-driven dynamic component
│   ├── captcha/         # CAPTCHA widget
│   ├── col-page/        # Column layout page
│   ├── count-to/        # Animated number counter
│   ├── cropper/         # Image cropper
│   ├── ellipsis-text/   # Truncated text with tooltip
│   ├── icon-picker/     # Icon selection
│   ├── json-viewer/     # JSON display
│   ├── loading/         # Spinner + directive (4 files)
│   ├── page/            # Page wrapper
│   ├── resize/          # Resize observer
│   ├── tippy/           # Tooltip directive (2 files)
│   └── tree/            # Tree view
└── ui/                  # Business UI modules
    ├── about/           # About page
    ├── authentication/  # Login, register, forgot-password, qrcode-login, code-login (11 files)
    ├── dashboard/       # Workbench with analytics widgets (6 files)
    ├── fallback/        # 403/404/500/offline pages + SVG icons (6 files)
    └── profile/         # Base, security, password, notification settings (7 files)
```

## WHERE TO LOOK

| Task | Location | Notes |
| --- | --- | --- |
| Login form | `src/ui/authentication/login.vue` | Uses `useVbenForm`, remember-me via localStorage |
| Register / forgot-password | `src/ui/authentication/` | `register.vue`, `forget-password.vue` |
| QR code login | `src/ui/authentication/qrcode-login.vue` | Depends on `qrcode` package |
| Dashboard workbench | `src/ui/dashboard/workbench/` | `workbench-header.vue`, `workbench-project.vue`, etc. |
| Fallback pages | `src/ui/fallback/` | `fallback.vue` + `icons/` with SVG assets |
| Profile settings | `src/ui/profile/` | `profile.vue` hosts base, security, password, notification tabs |
| Tippy directive | `src/components/tippy/` | Wraps `tippy.js` as Vue directive |
| Loading spinner | `src/components/loading/` | `loading.vue` + `spinner.vue` + directive |
| Re-exports | `src/components/index.ts` | Exports all of form-ui, popup-ui, selected shadcn-ui symbols |

## CONVENTIONS

- Components use `<script setup lang="ts">`. `defineOptions` sets PascalCase `name`.
- Props interfaces named `Props`. Emits use typed tuple syntax: `defineEmits<{ submit: [values] }>()`.
- Base UI imported from `@vben-core/shadcn-ui` (VbenButton, VbenCheckbox, VbenAvatar, etc.).
- Forms built with `useVbenForm` from `@vben-core/form-ui`.
- Translations via `$t` from `@vben/locales`.
- Sibling imports use relative paths. Cross-package use `@vben/*` or `@vben-core/*`.
- `src/components/index.ts` re-exports everything from `@vben-core/form-ui`, `@vben-core/popup-ui`, and selected `@vben-core/shadcn-ui` symbols.

## ANTI-PATTERNS

- Do NOT use `#/api`, `#/layouts`, `#/locales`, or `#/stores` aliases inside this package. Import via `@vben/*` or `@vben-core/*` instead.
- Do NOT add runtime dependencies on other effects packages.
- Do NOT duplicate primitives already in shadcn-ui. Compose them.
- Do NOT hardcode auth redirect paths. Accept them via props.
