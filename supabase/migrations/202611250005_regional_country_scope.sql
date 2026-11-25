-- Restrict regional representatives to operational records within their assigned country.
-- Retailers and administrators retain their existing access.
drop policy if exists "allocation own or admin read" on public.consignment_allocations;
create policy "allocation own or admin read" on public.consignment_allocations
for select to authenticated
using (
 retailer_user_id=auth.uid()
 or public.current_role()='admin'
 or (
  public.current_role()='regional_rep'
  and exists (
   select 1 from public.inventory_locations l
   join public.profiles me on me.id=auth.uid()
   where l.id=consignment_allocations.location_id
    and me.country_code is not null
    and upper(trim(l.country))=upper(trim(me.country_code))
  )
 )
);
drop policy if exists "sales own or admin read" on public.sales_orders;
create policy "sales own or admin read" on public.sales_orders
for select to authenticated
using (
 retailer_user_id=auth.uid()
 or public.current_role()='admin'
 or (
  public.current_role()='regional_rep'
  and exists (
   select 1 from public.profiles retailer
   join public.profiles me on me.id=auth.uid()
   where retailer.id=sales_orders.retailer_user_id
    and me.country_code is not null
    and upper(trim(retailer.country_code))=upper(trim(me.country_code))
  )
 )
);
