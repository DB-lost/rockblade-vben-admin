## OVERVIEW
Third-party plugin wrappers (ECharts, vxe-table, Vueuse Motion). Subpath exports keep bundles lean. Apps import only what they need.

## STRUCTURE
src/
  echarts/
    echarts.ts        # Core: init, destroy, resize
    use-echarts.ts    # Composable with ResizeObserver
    echarts-ui.vue    # Wrapper component
  vxe-table/
    use-vxe-grid.vue  # Grid wrapper component
    use-vxe-grid.ts   # Grid composable
    extends.ts        # Custom sort, renderers, editors
    types.ts          # Grid option/column types
    api.ts            # API helpers
    init.ts           # Plugin setup
    style.css         # Overrides
  motion/
    index.ts          # Re-export MotionPlugin, Motion, MotionGroup
    types.ts          # Motion type definitions

## WHERE TO LOOK

| Task | Import | Key files |
| --- | --- | --- |
| Charts | `@vben/plugins/echarts` | `echarts.ts`, `use-echarts.ts`, `echarts-ui.vue` |
| Data tables | `@vben/plugins/vxe-table` | `use-vxe-grid.vue/ts`, `extends.ts`, `types.ts` |
| Animations | `@vben/plugins/motion` | `index.ts`, `types.ts` |
