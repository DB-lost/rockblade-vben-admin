# @vben-core/shadcn-ui

## OVERVIEW

Foundation UI component library, 253 Vue components following shadcn and Reka-ui patterns. Consumed as source, no dist build.

## STRUCTURE

```
src/
├── ui/                    # Component directories (16 subdirs)
│   ├── context-menu/      # 16 files
│   ├── dropdown-menu/     # 15 files
│   ├── select/            # 12 files
│   ├── sheet/             # 11 files
│   ├── dialog/            # 11 files
│   ├── stepper/           # 8 files
│   ├── form/              # 8 files
│   ├── breadcrumb/        # 8 files
│   ├── alert-dialog/      # 8 files
│   ├── card/              # 7 files
│   ├── pagination/        # 6 files
│   └── number-field/      # 6 files
├── components.ts          # Public re-exports
└── index.ts               # Package entry
```

## WHERE TO LOOK

| Task                    | Location                                  |
| ----------------------- | ----------------------------------------- |
| Add a new component     | `src/ui/<component-name>/`                |
| Export a component      | `src/components.ts`                       |
| Form validation logic   | `src/ui/form/` (vee-validate integration) |
| Animated number display | `src/ui/count-to-animator/`               |
| Component barrel file   | Each `src/ui/<name>/index.ts`             |

## CONVENTIONS

- Component files live in kebab-case directories under `src/ui/`
- Each directory exposes a barrel `index.ts`
- Macro order: `defineOptions` → `defineProps` → `defineEmits` → `defineSlots`
- Props typed with TypeScript interfaces, exported from the component file
- Slots and emits declared explicitly
- Styles co-located with components (usually `<style scoped>` or UnoCSS classes in template)
- shadcn/Reka-ui primitives used for accessibility and behavior

## ANTI-PATTERNS

- DO NOT import `@vben/*` or `@vben-core/*` packages inside this package. Foundation layer must stay dependency-free.
- DO NOT introduce workspace dependencies in `package.json`.
- DO NOT use `onFinished` or `onStarted` events in `count-to-animator`. Use `finished` and `started` instead.
- DO NOT add a build step or emit a `dist` folder. Consumers import source directly.
- DO NOT use generic component boilerplate. Every component must match the shadcn/Reka-ui API shape used elsewhere in the repo.
