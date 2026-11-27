# ADICo Global

ADICo-owned retailer marketplace. Initial launch markets: Liberia and Norway.

## Business rules
- Retailer-only commercial network; no public-investor recruitment or investment-return features.
- Approved retailers receive stock on consignment.
- Retailers earn 10% commission calculated on the final retail selling price for eligible completed, settled sales.
- ADICo's minimum retail pricing policy is a 30% markup on wholesale cost (wholesale cost × 1.30).
- Supplier wholesale costs are confidential and must not be displayed in the public catalogue.
- Customers may purchase without retailer membership.
- Territories are non-exclusive by default.
- Liberia and Norway are seeded as disabled until local legal, tax, payment, product and fulfilment readiness is approved.

## Stack
Next.js App Router, TypeScript, Supabase Auth/Postgres. This repository is the web/API foundation; native mobile clients can use the same API later.

## Local setup
1. Copy `.env.example` to `.env.local` and fill in your Supabase project URL and publishable/anon key.
2. Run `npm install`, then `npm run dev`.
3. Review `supabase/migrations` against the existing Supabase schema before applying any migration.

Never put a Supabase service-role key in browser code or commit secrets.


## Current application routes
- `/` — public ADICo Global landing page.
- `/retailer-interest` — public retailer enquiry intake for Liberia and Norway.
- `/catalogue` — public read-only catalogue; only active products appear.
- `/admin/retailer-interest` — authenticated administrator review workspace.

## Database migration order
Apply only after reviewing the live schema, preferably in a staging project:
1. `202611250001_retailer_interest_requests.sql`
2. `202611250002_commerce_foundation.sql`
3. `202611250003_admin_enquiry_review.sql`

The migrations are committed but have not been applied to the connected Supabase production database. Existing profiles and role structures are intentionally preserved.

## Validation
- `npm run typecheck` runs TypeScript validation.
- GitHub Actions workflow `.github/workflows/ci.yml` runs type checking and a Next.js production build on pushes and pull requests to main.
