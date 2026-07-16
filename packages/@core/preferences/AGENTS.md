## OVERVIEW

Core preference store for user settings. Reactive, persisted, CSS-synced.

## EXPORTS

| Symbol | Role |
| --- | --- |
| `PreferenceManager` | Singleton class: load, merge, watch, persist |
| `preferencesManager` | Singleton instance |
| `initPreferences` | Bootstrap with namespace + overrides before Vue mounts |
| `getPreferences` | Readonly reactive `Preferences` state |
| `updatePreferences` | Deep partial merge; triggers CSS sync + cache save |
| `resetPreferences` | Revert to initial values (overrides + defaults) |
| `clearCache` | Wipe all preference localStorage keys |
| `usePreferences` | Composable exposing computed flags: `isDark`, `isMobile`, `layout`, `keepAlive`, `sidebarCollapsed`, etc. |
| `defaultPreferences` | Full default config object from `config.ts` |
| `updateCSSVariables` | Sync theme colors, radius, font-size to CSS custom properties |
| `BUILT_IN_THEME_PRESETS` / `COLOR_PRESETS` | Theme color constants |
| `Preferences`, `AppPreferences`, `ThemePreferences`, ... | Type definitions |

## CONVENTIONS

- **Init order**: `initPreferences({ namespace, overrides })` runs before `createApp()` in `main.ts`
- **Storage**: `StorageManager` with namespace-prefixed localStorage; debounced save at 150ms
- **State access**: Always readonly; mutate only through `updatePreferences()`
- **Watchers**: `useBreakpoints` toggles `app.isMobile`; `prefers-color-scheme` flips `theme.mode` when set to `auto`
- **CSS sync**: `updateCSSVariables()` runs on every theme change, setting `dark` class, `data-theme`, and HSL color variables on `:root`
- **Color modes**: `app.colorGrayMode` / `app.colorWeakMode` toggle `grayscale-mode` / `invert-mode` classes
- **Update flow**: `updatePreferences` → deep merge (`markRaw`) → `Object.assign(state)` → `handleUpdates` → debounced cache write
