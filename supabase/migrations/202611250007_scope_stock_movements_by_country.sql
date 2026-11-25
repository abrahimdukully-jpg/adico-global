drop policy if exists "stock movement admin read" on public.stock_movements;
create policy "stock movement admin read" on public.stock_movements for select to authenticated
using (public.current_role()='admin' or (public.current_role()='regional_rep' and exists(select 1 from public.inventory_locations l join public.profiles me on me.id=auth.uid() where l.id=stock_movements.location_id and me.country_code is not null and upper(trim(l.country))=upper(trim(me.country_code)))));
notify pgrst,'reload schema';