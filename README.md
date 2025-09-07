# Travel Journal API: App Team Carolina Take-Home Project

## Presentation Overview

Josh Robertson 2025

---

## 1. Endpoints, Parameters, and Response Formats

### Core Endpoints

| Method | Endpoint                | Description              | Parameters                     |
| ------ | ----------------------- | ------------------------ | ------------------------------ |
| POST   | /api/travel-records     | Create new travel record | weather (optional query param) |
| GET    | /api/travel-records     | List all travel records  | –                              |
| GET    | /api/travel-records/:id | Get a specific record    | id (path)                      |
| PATCH  | /api/travel-records/:id | Partially update record  | id (path)                      |
| DELETE | /api/travel-records/:id | Delete record            | id (path)                      |

### Create Example

```bash
POST /api/travel-records?weather=true
Content-Type: application/json
{
  "destinationName": "Paris",
  "country": "France",
  "visitDate": "2023-07-15",
  "rating": 5
}
```

Response 201:

```json
{
  "id": "uuid",
  "destinationName": "Paris",
  "country": "France",
  "visitDate": "2023-07-15",
  "rating": 5,
  "weather": "clear sky",
  "createdAt": "2025-09-06T00:52:40.468Z",
  "updatedAt": "2025-09-06T00:52:40.468Z"
}
```

### Validation Error Example

```json
{
  "error": "Validation error",
  "details": [{ "field": "rating", "message": "Number must be less than or equal to 5" }]
}
```

OpenAPI spec: `openapi.yaml` (served at `/api-docs`).

---

## 2. Thought Process & Problem Solving

### Key Considerations

1. Predictable REST surface
2. Strong validation + consistent errors
3. Optional enrichment (weather) without coupling core logic to a flaky external API
4. Simple in‑memory persistence to focus on API design
5. Extensibility for future DB/auth additions
6. Clear contract via OpenAPI early
7. Testability at service and route layers

### Major Challenges & Solutions

| Challenge              | Issue                                     | Solution                                                | Result                               |
| ---------------------- | ----------------------------------------- | ------------------------------------------------------- | ------------------------------------ |
| Weather integration    | External API failures/timeouts            | Wrapped fetch in try/catch → translate to 502 HTTPError | Upstream failures never crash server |
| Validation consistency | Raw Zod errors nested & noisy             | `flattenZodErrors` utility to normalize                 | Uniform error payloads               |
| Partial updates        | Avoid accepting invalid fields            | `TravelRecordInputSchema.partial()` for PATCH           | Safe, minimal patching               |
| Error uniformity       | Different throw shapes                    | Central `HTTPError` + global handler in `app.ts`        | One response shape                   |
| Type/runtime drift     | TS types vs runtime validation divergence | Zod as single source of truth                           | Fewer mismatch bugs                  |

### Endpoint Structure & Tradeoffs (Project-Specific)

Implementation (see `src/routes/travelRoutes.ts`):

```ts
router.post('/');
router.get('/');
router.get('/:id');
router.patch('/:id');
router.delete('/:id');
```

Decisions:

- Flat resource path `/api/travel-records` (no users yet) → avoids premature multi‑tenant complexity.
- Optional behavior (`?weather=true`) via query param → explicit, visible in URL, easy in curl/Postman.
- PATCH over PUT → partial updates reduce client burden.
- No versioning yet → simpler; add `/api/v1` when first breaking change appears.

Alternatives Considered:

- Nested: `/api/users/:userId/travel-records` (rejected: no auth layer yet)
- RPC style: `/api/travel-records/create` (rejected: breaks REST conventions & tooling expectations)
- Weather via header (less discoverable vs query string for demo)

---

## 3. Why These Choices

### Technology

| Choice          | Reason                             | Alternative            | Why Not Alt                  |
| --------------- | ---------------------------------- | ---------------------- | ---------------------------- |
| TypeScript      | Static safety + DX                 | JS                     | Runtime errors surface later |
| Zod             | Unified types + runtime validation | Joi / Yup              | Less tight TS inference      |
| In‑memory store | Fast iteration for take‑home       | DB now                 | Adds setup overhead          |
| OpenAPI (yaml)  | Single contract file               | Inline JSDoc           | Harder to centralize         |
| UUID            | Collision-resistant IDs            | Auto-increment numbers | Needs DB, risk of guessing   |

### Architecture

Layers:

```
Controller -> Service -> (Schema/Model) -> (External APIs)
```

I did this for isolation of business logic (service) for direct unit tests (`travelService.test.ts`). Controllers stay simple and easy to understand the project at large.

### Error Strategy

Single `HTTPError` pathway ensures tests can assert on status and shape. Default 500 fallback prevents leaking internal details.

---

## 4. Future Enhancements

### High Priority

1. Real DB (Postgres + Prisma) or MongoDB
2. Auth
3. Filtering & querying (country, date range, rating >= N)
4. Rate limiting + request logging

### Medium

- Caching weather lookups (Redis TTL)
- Aggregation endpoints (top countries, avg rating)
- File/image upload (S3) for `imageUrl`
- API versioning strategy
- Health & readiness endpoints

---

## Quick Start

```bash
git clone https://github.com/joshrobertson8/JRappteam25.git
cd JRappteam25
npm install
npm run dev
# (Optional) export OPENWEATHER_API_KEY=... before create with ?weather=true
```

### Example curl

```bash
curl -X POST 'http://localhost:4000/api/travel-records?weather=true' \
  -H 'Content-Type: application/json' \
  -d '{"destinationName":"Paris","country":"France","visitDate":"2023-07-15","rating":5}'
```

Docs: http://localhost:4000/api-docs

---

## Tests

Run: `npm test`

- Service layer: creation, validation, update/delete, not-found paths
- Routes: integration of all CRUD operations

---

## Environment

| Variable            | Purpose                  | Required                    |
| ------------------- | ------------------------ | --------------------------- |
| PORT                | HTTP port (default 4000) | No                          |
| OPENWEATHER_API_KEY | Weather enrichment       | Only if using ?weather=true |

Loads via `import 'dotenv/config'` in `src/server.ts`.

---

## OpenAPI / Swagger

- Spec file: `openapi.yaml`
- Served via `yamljs` + `swagger-ui-express` in `src/routes/docs.ts`
- Try endpoints interactively at `/api-docs`

---

## Limitations (Intentional)

- In-memory store only
- No auth
- No rate limiting or structured logging
- Weather integration limited

---
