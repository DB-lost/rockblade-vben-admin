# @vben/layouts — AGENTS.md

## OVERVIEW

Pre-built admin layout shell combining all ui-kits, menus, tabs, and forms into BasicLayout and AuthPageLayout. (~100 files, Pinia-driven.)

## STRUCTURE

```
src/
├── basic/               # BasicLayout shell + menu + header + tabbar + footer + copyright + content spinner
├── widgets/             # Standalone widgets: breadcrumb, global-search, notification, lock-screen, user-dropdown, theme-toggle, language-toggle, check-updates, timezone
│   └── preferences/     # Preferences drawer with blocks (layout, theme, general, shortcut-keys) and layout-mode icons
├── authentication/      # AuthPageLayout, login form wrapper, toolbar, slogan icon
├── iframe/              # Iframe router view and iframe view components
├── route-cached/        # Route cached view and page wrappers
└── hooks/               # Layout hooks: useLayoutHook, transformComponent
```

## WHERE TO LOOK

| Task | Location |
| --- | --- |
| Main layout shell | `src/basic/layout.vue` |
| Menu rendering | `src/basic/menu/` — menu.vue, mixed-menu.vue, extra-menu.vue, plus use-mixed-menu.ts, use-navigation.ts, use-extra-menu.ts |
| Header slot map | `src/basic/header/header.vue` and `src/basic/README.md` |
| Tabbar | `src/basic/tabbar/tabbar.vue`, `use-tabbar.ts` |
| Preferences drawer | `src/widgets/preferences/preferences-drawer.vue` |
| Layout blocks | `src/widgets/preferences/blocks/layout/` (footer, breadcrumb, layout, widget, sidebar, copyright, tabbar, header, navigation, content) |
| Theme blocks | `src/widgets/preferences/blocks/theme/` (font-size, color-mode, radius, theme, builtin) |
| Layout mode icons | `src/widgets/preferences/icons/` (10 SVG-like Vue components) |
| Auth layout | `src/authentication/authentication.vue` |
| Route transitions | `src/hooks/index.ts` |

## CONVENTIONS

- Widgets are self-contained: each subdir exports its own index.ts
- Preferences blocks reuse generic wrappers: toggle-item, switch-item, checkbox-item, select-item, input-item, number-field-item
- Menu system splits into standard menu, mixed-nav, and extra-menu with dedicated composables
- Layout shell reads from `@vben/preferences` and `@vben/stores` for state
- Header slots use fixed index ranges: left 0-19/breadcrumb 21+, right 0-49 global-search, 51-59 theme, 61-69 language, 71-79 fullscreen, 81-89 notification, 91-149 user-dropdown, 151+

## ANTI-PATTERNS

- DO NOT import `#/api`, `#/layouts`, `#/locales`, `#/stores` — use `@vben/*` re-exports instead
- DO NOT add business logic to layout widgets — keep them presentational
- DO NOT hardcode new slot indices without documenting them in `src/basic/README.md`
- DO NOT bypass `@vben/preferences` for layout state — all layout config must flow through the preference store
