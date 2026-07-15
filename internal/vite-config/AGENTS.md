## OVERVIEW

Shared Vite build configuration for the monorepo. Package `@vben/vite-config` exposes `defineApplicationConfig` and `defineLibraryConfig` with 15+ built-in plugins.

## STRUCTURE

```
src/
├── config/
│   ├── application.ts    # App builds: es2015 target, global SCSS injection, warmup
│   ├── library.ts        # Lib builds: dts generation, minimal plugins
│   └── common.ts         # Shared defaults: resolve aliases, build output, CSS
├── plugins/
│   ├── index.ts          # Plugin loader: conditionally loads plugins by build type
│   ├── archiver.ts       # Post-build zip archive
│   ├── compression.ts    # Brotli / gzip asset compression
│   ├── extra-app-config.ts  # Runtime env injection
│   ├── importmap.ts      # ES module import map generation
│   ├── inject-app-loading/  # HTML loading screen before Vue mounts
│   ├── inject-metadata.ts   # Build metadata (time, git hash) into HTML
│   ├── license.ts        # OSS license attribution file
│   ├── nitro-mock.ts     # Auto-starts backend-mock Nitro server in dev
│   ├── print.ts          # Terminal banner with project info
│   ├── tailwind-reference.ts
│   └── vxe-table.ts      # Lazy import optimization for vxe-table
├── options.ts            # Default PWA and importmap options
├── typing.ts             # Plugin option type definitions
└── utils/env.ts          # Env loading and conversion
```

## PLUGINS

| Plugin | Role |
|--------|------|
| **Vue** | SFC compilation with `defineModel` support |
| **Vue JSX** | JSX transform for Vue components |
| **Tailwind CSS** | v4 Tailwind Vite integration + reference injection |
| **i18n** | `@intlify/unplugin-vue-i18n` for runtime-only locale bundles |
| **PWA** | `vite-plugin-pwa` with NetworkFirst API caching |
| **compression** | Brotli and/or gzip static asset compression |
| **HTML** | `vite-plugin-html` with minification |
| **nitro-mock** | Auto-starts `apps/backend-mock` Nitro server on dev; proxies `/api` |
| **inject-app-loading** | Injects loading HTML into `index.html` before Vue hydrates |
| **inject-metadata** | Embeds build time and git commit hash into page metadata |
| **license** | Generates third-party license attribution file |
| **archiver** | Creates zip archive of `dist/` after build |
| **importmap** | Generates ES module import maps via `@jspm/generator` |
| **vxe-table** | Lazy-imports vxe-table submodules to reduce bundle size |
| **visualizer** | Rollup bundle analyzer (`stats.html`) |
| **devtools** | `vite-plugin-vue-devtools` (dev only) |
| **extra-app-config** | Injects runtime app configuration from env |
| **print** | Prints project banner and docs link in dev terminal |
