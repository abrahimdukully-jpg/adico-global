# ADICo Global commerce foundation

## Included
- Retailer account records, separate from the existing authentication profile and role enum.
- Product catalogue, category and country-availability tables.
- Warehouse and inventory movement ledger.
- Consignment headers and line items with issued/sold/returned quantity constraints.
- Customer order and order-item records.
- Commission ledger fixed at 10% of eligible completed sales, with review and payout states.
- Public read-only catalogue policies and conservative administrative read policies.
- Customer-facing catalogue route at /catalogue.

## Important controls
- This migration does not add a new enum value or alter existing profiles, account_role, or current_role().
- It does not permit direct browser writes to orders, stock, consignments, or commission tables.
- Payment capture, order confirmation, inventory deduction, commission creation, refunds, and settlement approval must be authenticated server-side operations with idempotency, audit logging, and verified payment-provider webhooks.
- No sample products, prices, stock quantities, or retailer records are seeded.
- Country availability remains opt-in; products are not purchasable merely because they exist in the catalogue.

## Apply only after review
1. Confirm the existing profiles.id type and current_role() return behavior.
2. Review the migration in Supabase SQL Editor.
3. Apply it to a staging project first, not directly to production.
4. Verify RLS using anon, ordinary authenticated, retailer, and administrator accounts.
5. Configure Next.js environment variables in hosting. Never expose a service-role key in client code.

## Still required before production
- Reconcile existing retailer-interest requests into approved retailer accounts only after verification and signed consignment terms.
- Build privileged server-side workflows for retailer decisions, product administration, stock receipt/issue/return, order state transitions, payment webhooks, commission calculation and settlement.
- Connect payment and fulfilment partners separately for Liberia and Norway.
- Complete local legal, tax, consumer, privacy, import/export and product compliance review.
- Configure backups, monitoring, email delivery, rate limiting, anti-spam, error reporting and operational support.
- Complete end-to-end tests and a controlled pilot before enabling either country.
