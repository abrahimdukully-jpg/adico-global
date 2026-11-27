-- ADICo Global pricing policy: 30% minimum markup over confidential wholesale cost.
-- Existing products remain unchanged; wholesale_cost is nullable until supplier costs are verified.
alter table public.products
  add column if not exists wholesale_cost numeric(12,2);

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'products_wholesale_cost_nonnegative'
      and conrelid = 'public.products'::regclass
  ) then
    alter table public.products
      add constraint products_wholesale_cost_nonnegative
      check (wholesale_cost is null or wholesale_cost >= 0);
  end if;
  if not exists (
    select 1 from pg_constraint
    where conname = 'products_minimum_retail_markup_30'
      and conrelid = 'public.products'::regclass
  ) then
    alter table public.products
      add constraint products_minimum_retail_markup_30
      check (wholesale_cost is null or retail_price >= round(wholesale_cost * 1.30, 2));
  end if;
end $$;
