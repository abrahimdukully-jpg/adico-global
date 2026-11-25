-- Allow administrators to progress enquiry review without exposing records publicly.
drop policy if exists retailer_interest_admin_update on public.retailer_interest_requests;
create policy retailer_interest_admin_update
on public.retailer_interest_requests
for update to authenticated
using (public.current_role() = 'admin')
with check (public.current_role() = 'admin');
grant update(status) on public.retailer_interest_requests to authenticated;
