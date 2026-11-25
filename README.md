# ADICo Global

ADICo-owned retailer marketplace. Initial launch markets: Liberia and Norway.

## Business rules
- Retailer-only commercial network; no public-investor recruitment or investment-return features.
- Approved retailers receive stock on consignment.
- Retailers earn 10% commission on eligible completed, settled sales.
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
