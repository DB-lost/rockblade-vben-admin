# PROJECT KNOWLEDGE BASE

## OVERVIEW

Nitro mock API server (`@vben/backend-mock`). Serves fake data for frontend dev. Auto-starts via Vite plugin on port 5320. No database, all data is generated.

## STRUCTURE

```
api/           # Route handlers (Nitro file-based routing)
middleware/    # CORS and request middleware
routes/        # Catch-all fallback
utils/         # JWT, cookies, timezone, response helpers, mock data
```

## API ENDPOINTS

- `auth/` — login, logout, refresh, public key
- `system/` — menus, roles, departments
- `table/` — paginated list data
- `timezone/` — get/set timezone options
- `upload/` — file upload mock
- `demo/` — bigint demo
- `common/` — codes, info, status

## CONVENTIONS

- File-based routing: `api/[path].method.ts` or `api/[path]/[param].method.ts`
- Return standardized responses via `utils/response.ts`
- JWT auth via `utils/jwt-utils.ts` with hardcoded secrets in `.env` (replace before prod)
- Cookie handling via `utils/cookie-utils.ts`
- Mock data generated with `@faker-js/faker` in `utils/mock-data.ts`
- CORS configured in `middleware/1.api.ts` and `nitro.config.ts`
- Catch-all route at `routes/[...].ts`
