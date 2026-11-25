-- Grant the authenticated application role the table privileges required by
-- the admin inventory page. Row-level security policies continue to restrict
-- access to administrators, retailers' own records, and country-scoped reps.
grant select on table public.inventory_locations, public.retailer_applications, public.consignment_allocations, public.stock_movements to authenticated;
grant insert on table public.inventory_locations to authenticated;
notify pgrst, 'reload schema';
