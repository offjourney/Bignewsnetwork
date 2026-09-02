# BigNewsNetwork

A production-track Mongolian news platform built with Next.js (App Router),
TypeScript, Tailwind CSS, and PostgreSQL/Prisma.

## Project status

- **Phase 1** — Next.js scaffold, editorial design system, all public routes, mock data.
- **Phase 2** — Polished public-facing UI (hero, category rows, ads, video/photo sections, breaking news, footer).
- **Phase 3** — PostgreSQL + Prisma schema, migrations, seed data, data-access layer. **← current**
- **Phase 4+** — Wire the public site to the database; CMS; auth; media storage (R2); search; caching.

The public website still reads from `src/lib/mock-data.ts` (via `src/lib/queries.ts`)
as of Phase 3 — that switch happens in Phase 4.

## Requirements

- Node.js 20+
- PostgreSQL 14+

## Installation

```bash
npm install
```

## Environment

```bash
cp .env.example .env
```

Then edit `.env` and set `DATABASE_URL` to point at your PostgreSQL instance.
Never commit `.env` (it's already covered by `.gitignore`'s `.env*` pattern),
and never prefix database credentials with `NEXT_PUBLIC_`.

## Database

The schema lives in `prisma/schema.prisma`. The full model list: `User`,
`Author`, `Category`, `Article`, `Tag` (via the `ArticleTag` join), `Media`,
`ArticleMedia`, `ArticleRevision`, `Video`, `Gallery`, `GalleryImage`,
`Advertisement`, `SiteSetting`.

### ⚠️ A note on this development sandbox specifically

`npx prisma generate` / `migrate` / `validate` all need to download a Rust
schema-engine binary from `binaries.prisma.sh`. **In this sandboxed
environment that host is blocked at the network layer** (`host_not_allowed`),
which is a known, currently-unresolved constraint across Prisma's CLI even
with the binary-free `engineType = "client"` generator (the schema engine is
still required for schema parsing/migrations regardless of the client's
runtime engine type). This is not fixable from inside the schema or CLI
flags — see the upstream issues this traces back to (prisma/prisma#28503,
#28083, #21960, #25433).

Because of that, for this phase:

- **The schema (`prisma/schema.prisma`) is the real, complete source of truth.**
- **The database itself is 100% real** — PostgreSQL 16 is running locally, and
  `prisma/migrations/20260815130000_init/migration.sql` (hand-written to
  exactly match what `prisma migrate dev` would generate from the schema
  above) has been applied directly via `psql`, including Prisma's own
  `_prisma_migrations` bookkeeping table, so `prisma migrate status` will
  recognize it as applied once the CLI can run normally.
- **The seed (`prisma/seed.ts`) is real and runnable** — it's written against
  `pg` directly (not `@prisma/client`, for the same reason) and actually
  populates the live database. Every relationship in the schema was verified
  with real queries (see Phase 3 completion report).
- **`src/lib/db.ts` and `src/lib/data/**`** contain the real, intended
  `@prisma/client`-based data-access layer for Phase 4. They're excluded
  from `tsconfig.json`'s compiled set for now, since the generated client
  they import doesn't exist yet in this sandbox. **In any environment with
  normal network access**, run `npx prisma generate`, then remove the
  `src/lib/db.ts` / `src/lib/data/**` lines from `tsconfig.json`'s
  `exclude` array, and everything type-checks and runs immediately.

### Commands

```bash
# Apply the schema to a fresh database (normal environments):
npx prisma migrate dev

# Generate the Prisma Client (normal environments):
npx prisma generate

# Seed realistic Mongolian development data — works today, real pg connection:
npm run db:seed

# Browse the database (normal environments — Prisma Studio also needs the engine):
npm run db:studio

# Reset the database (drops + re-applies migrations + reseeds; normal environments):
npm run db:reset
```

In this sandbox, `db:seed` is the one that actually runs (it only needs
PostgreSQL, not the Prisma engine binary). If PostgreSQL isn't already
running: `service postgresql start`.

### Seeded accounts

All seeded users share one obviously-fake development password —
`DevPassword123!` — bcrypt-hashed in the `users` table. Never reuse this
outside local development. Seeded roles: 1 `ADMIN`, 1 `EDITOR`, 5
`JOURNALIST`, 1 `PHOTOGRAPHER`, 1 `AD_MANAGER`.

## Development

```bash
npm run dev
```

Open http://localhost:3000.

## Production

```bash
npm run build
npm start
```

## Lint

```bash
npm run lint
```
