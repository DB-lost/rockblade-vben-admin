# SCRIPTS KNOWLEDGE BASE

## OVERVIEW

CLI tools and deployment scripts for the monorepo.

## STRUCTURE

```
scripts/
├── vsh/                   # @vben/vsh — custom CLI toolkit
│   ├── src/
│   │   ├── lint/          # Batch lint runner
│   │   ├── check-circular.ts
│   │   ├── check-dep.ts
│   │   ├── code-workspace.ts
│   │   └── publint.ts
│   └── bin/vsh.mjs
├── turbo-run/             # @vben/turbo-run — interactive TUI
│   ├── src/
│   │   └── run.ts         # Package selector + command executor
│   └── bin/turbo-run.mjs
├── deploy/
│   ├── Dockerfile         # Multi-stage: node:22-slim → nginx:stable-alpine
│   ├── nginx.conf
│   └── build-local-docker-image.sh
└── clean.mjs              # Recursive rm of node_modules, dist, .turbo, dist.zip
```

## COMMANDS

| Tool | Command | What it does |
| --- | --- | --- |
| vsh | `lint [--format]` | Parallel oxfmt + oxlint + eslint + stylelint. `--format` runs with `--fix` |
| vsh | `check-circular` | circular-dependency-scanner across workspaces |
| vsh | `check-dep` | depcheck for unused dependencies |
| vsh | `publint` | Validate package.json files against npm publish standards |
| vsh | `code-workspace` | Auto-generate VS Code .code-workspace file |
| turbo-run | `turbo-run <script>` | Interactive @clack/prompts TUI to select packages, then `pnpm --filter=<pkg> run <script>` |
| clean.mjs | `node scripts/clean.mjs [--del-lock]` | Recursively delete node_modules, dist, .turbo, dist.zip. Optional: also delete pnpm-lock.yaml |

## NOTES

- Both CLI packages use `cac` for argument parsing and `@vben/node-utils` for shared utilities.
- `vsh` is the primary dev tool. `turbo-run` powers `pnpm dev`.
- Deploy scripts are standalone shell/Docker files, not published packages.
