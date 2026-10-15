# Sablylo Catalog API — Phase 1 scaffold

This **development-branch-only** service is intentionally read-only. It does not replace the live Hostinger store, enable admin writes, or process orders.

## Local setup

Use Node.js 22. In the repository root, run `npm install`. Copy `apps/api/.env.example` to `apps/api/.env` and populate the local MySQL credentials privately. Create an empty database and run:

```sh
npm run db:migrate --workspace @sablylo/api
npm test --workspace @sablylo/api
npm run dev --workspace @sablylo/api
```

Endpoints: `GET /api/health`, `GET /api/v1/categories`, `GET /api/v1/products?page=1&limit=15&q=...`, `GET /api/v1/products/:slug`.

Never commit real environment variables. Do not expose the MySQL service to the public internet. Deploy the API separately from the static React storefront; do not change the main branch or existing frontend build until API staging tests pass.

This is a foundation, not production-ready commerce. Pending: admin authentication and authorization, migrations in CI/staging, protected write endpoints, backups/restore tests, supplier verification, storefront adapter, checkout, and inventory reservations.
