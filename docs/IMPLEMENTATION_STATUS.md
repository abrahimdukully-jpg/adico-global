# Implementation status

## Committed in this phase
- Next.js App Router + TypeScript starter.
- ADICo Global branded landing page.
- Supabase browser/server client helpers using publishable/anon key only.
- Session-refresh middleware.
- Environment variable template with placeholders only.

## Not yet connected or deployed
- No production URL or hosting project is configured in this repository.
- Supabase schema is not migrated or modified by this commit.
- Authentication screens, retailer workflows, payments, inventory, commission settlement and admin controls remain to be implemented.
- Country activation remains disabled until country-specific compliance and operational readiness are signed off.

## Safe next steps
1. Confirm the app builds in the connected deployment environment.
2. Reconcile additive migrations with the existing Supabase `profiles`, `account_role`, `current_role()` and `audit_events` objects before applying.
3. Implement privileged business operations as server-side/Edge Functions with audit logging and idempotency.
