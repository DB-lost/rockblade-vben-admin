# PROJECT KNOWLEDGE BASE

**Package:** `@vben-core/menu-ui`

## OVERVIEW

Headless menu navigation primitives with Reka-ui accessibility patterns. Zero `@vben/*` workspace deps, only `@vben-core/*` foundation packages.

## STRUCTURE

```
src/
├── menu.vue                    # Root Menu container (accordion, collapse, theme)
├── sub-menu.vue                # SubMenu wrapper (popup / inline toggle)
├── types.ts                    # MenuProps, SubMenuProps, MenuProvider, SubMenuProvider
├── index.ts                    # Public exports: Menu, MenuBadge, NormalMenu, types
├── components/
│   ├── menu.vue                # Internal menu renderer
│   ├── menu-item.vue           # Clickable leaf item with icon / activeIcon
│   ├── sub-menu.vue            # Nested menu trigger
│   ├── sub-menu-content.vue    # Popup / inline submenu panel
│   ├── menu-badge.vue          # Numeric / text badge on items
│   ├── menu-badge-dot.vue      # Status dot indicator
│   ├── collapse-transition.vue # Height animation for accordion
│   ├── normal-menu/            # Simplified flat menu variant
│   │   ├── normal-menu.vue
│   │   └── normal-menu.ts
│   └── index.ts                # Component barrel export
├── hooks/
│   ├── use-menu.ts             # Menu state: openedMenus, activePath, click handlers
│   ├── use-menu-scroll.ts      # Virtual scroll + auto-scroll to active item
│   ├── use-menu-context.ts     # Provide / inject for MenuProvider / SubMenuProvider
│   └── index.ts
└── utils/
    └── index.ts                # flattedChildren, findComponentUpward
```

## WHERE TO LOOK

| Task | File | Note |
| --- | --- | --- |
| Change accordion / collapse / theme behavior | `src/menu.vue` | Root props forwarded via MenuProvider |
| Add badge logic or dot styling | `src/components/menu-badge.vue`, `menu-badge-dot.vue` | Consumes `MenuRecordBadgeRaw` |
| Tweak submenu popup positioning | `src/components/sub-menu-content.vue` | Mouseenter / mouseleave depth dispatch |
| Customize normal (flat) menu | `src/components/normal-menu/normal-menu.ts` | Separate simpler API |
| Scroll to active on route change | `src/hooks/use-menu-scroll.ts` | `scrollToActive` prop toggle |
| Inject / provide typing | `src/hooks/use-menu-context.ts` | `useMenuContext()`, `useSubMenuContext()` |
| Flatten slot VNodes for recursion | `src/utils/index.ts` | `flattedChildren()` helper |

## ANTI-PATTERNS

- **DO NOT** import `@vben/*` packages here. Keep `@vben-core/*` only.
- **DO NOT** add business route logic. This package is purely presentational.
