## OVERVIEW

Node.js utilities for monorepo build tooling.

## EXPORTS

| Module | Purpose |
|--------|---------|
| `fs.ts` | `outputJSON`, `readJSON`, `ensureFile` wrappers with auto-dir creation |
| `git.ts` | Git helpers: getStagedFiles, gitAdd, branch/tag/tagExists utilities |
| `hash.ts` | `generatorContentHash` for content-based cache busting |
| `monorepo.ts` | `findMonorepoRoot`, `getPackages`, `getPackage` via @manypkg |
| `path.ts` | `toPosixPath` normalizes separators for cross-platform builds |
| `date.ts` | Dayjs-based formatting helpers for build timestamps |
| `formatter.ts` | `formatFile` invokes oxfmt on a single file |
| `constants.ts` | Shared build constants |
| `spinner.ts` | Ora wrapper for async CLI tasks with success/fail text |

## NOTES

- Package `@vben/node-utils`, consumed by `internal/vite-config` and `scripts/vsh`
- Built with `tsdown` (output `dist/index.mjs`)
- Re-exports: `chalk`, `consola`, `execa`, `rimraf`, `pkg-types`, `node:fs/promises`
- Unit tests cover `hash.ts` and `path.ts` under `src/__tests__/`