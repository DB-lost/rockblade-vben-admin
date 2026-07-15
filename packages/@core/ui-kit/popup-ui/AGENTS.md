## OVERVIEW
Imperative modal, drawer, and alert components for Vue 3. Composable-driven APIs with builder patterns. No business dependencies.

## STRUCTURE
```
src/
├── modal/       # modal.vue, modal-api.ts, use-modal.ts, draggable
├── drawer/      # drawer.vue, drawer-api.ts, use-drawer.ts
└── alert/       # alert.vue, alert.ts, AlertBuilder.ts (provider pattern)
```

## WHERE TO LOOK
| Symbol | File | Role |
| --- | --- | --- |
| ModalApi | `src/modal/modal-api.ts` | Imperative modal controller |
| useModal | `src/modal/use-modal.ts` | Modal composable |
| useModalDraggable | `src/modal/use-modal-draggable.ts` | Drag behavior |
| DrawerApi | `src/drawer/drawer-api.ts` | Imperative drawer controller |
| useDrawer | `src/drawer/use-drawer.ts` | Drawer composable |
| AlertBuilder | `src/alert/AlertBuilder.ts` | Fluent alert factory |
| AlertProvider | `src/alert/alert.vue` | Root alert host |
| Tests | `src/modal/__tests__/` , `src/drawer/__tests__/` | API unit tests |
| Barrels | `src/{modal,drawer,alert}/index.ts` | Subpath entry points |
| Package entry | `src/index.ts` | Re-exports modal, drawer, alert |
