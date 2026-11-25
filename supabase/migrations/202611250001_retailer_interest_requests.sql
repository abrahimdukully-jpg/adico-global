-- ADICo Global: retailer interest intake.
-- Additive migration. Review against the live project before applying.
-- This table is intentionally separate from profiles and the existing account_role enum.

create table if not exists public.retailer_interest_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(trim(full_name)) between 2 and 120),
  email text not null check (char_length(email) <= 254),
  country_code text not null check (country_code in ('LR','NO')),
  business_type text not null check (business_type in ('individual','retail_shop','online_retailer','wholesaler','distributor')),
  business_name text,
  message text,
  consent_to_contact boolean not null default false check (consent_to_contact = true),
  status text not null default 'received' check (status in ('received','under_review','contacted','declined','converted')),
  created_at timestamptz not null default now()
);

alter table public.retailer_interest_requests enable row level security;

-- Public users may submit an enquiry, but cannot read, update or delete enquiries.
drop policy if exists retailer_interest_public_submit on public.retailer_interest_requests;
create policy retailer_interest_public_submit
on public.retailer_interest_requests
for insert
to anon, authenticated
with check (
  consent_to_contact = true
  and status = 'received'
);

-- Only existing administrators can read requests. No public status or PII exposure.
drop policy if exists retailer_interest_admin_read on public.retailer_interest_requests;
create policy retailer_interest_admin_read
on public.retailer_interest_requests
for select
to authenticated
using (public.current_role() = 'admin');

revoke all on public.retailer_interest_requests from anon, authenticated;
grant insert on public.retailer_interest_requests to anon, authenticated;
grant select on public.retailer_interest_requests to authenticated;
