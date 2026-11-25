# ADICo Global — production activation checklist

This repository contains application source and reviewed-draft database migrations. A GitHub commit is not a production deployment.

## 1. Supabase connection
- Confirm the Supabase project is the intended ADICo Global project.
- Back up the project before schema changes.
- Review migrations 202611250001, 202611250002 and 202611250003 against the live schema.
- Apply first to a staging project. Verify the existing profiles table, account_role enum, current_role() function and audit_events table remain intact.
- Run RLS tests as anon, authenticated retailer, regional representative and administrator.
- Do not expose a service-role/secret key in client-side code or NEXT_PUBLIC variables.

## 2. Hosting
- Connect this repository to a Next.js-compatible host such as Vercel.
- Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in the host's environment settings for preview and production.
- Keep production deployment disabled until migrations, environment variables and tests are verified.
- Configure the production domain, HTTPS and rollback process.

## 3. Required acceptance tests
- Public visitor can submit a valid retailer enquiry for LR or NO.
- Invalid email, unsupported country, invalid business type and missing consent are rejected.
- Public visitor cannot read or change enquiry records.
- Non-admin authenticated users cannot access the enquiry review data or update statuses.
- Administrator can view and update permitted enquiry statuses.
- Product catalogue shows only active products and does not expose draft products.
- Retailer cannot self-approve, alter stock ledger entries, set commission rates or approve own payout.
- Commission is calculated at 10% only for verified eligible completed sales; refunds, cancellations and disputes are excluded or reversed.
- Duplicate payment webhooks cannot duplicate order payments or commission entries.
- Stock movement, consignment issue, sale, return and reconciliation are auditable.

## 4. Business launch controls
- Verify product legality, import/export, customs, tax, consumer terms, refunds, privacy and data-transfer requirements for each active country.
- Confirm supplier, warehouse, delivery, returns and customer support arrangements.
- Execute retailer consignment and commission agreements before activating retailers.
- Keep Liberia and Norway unavailable for checkout until each country has passed the above checks.

## 5. Current status
- Source code is committed to GitHub.
- Initial database migrations are committed but have not been applied to production.
- Hosting deployment, payment provider, shipping provider, domain and production secrets are not confirmed by this repository.
- No live orders, payouts or stock movements should be represented as operational until end-to-end acceptance tests pass.
