-- Live compatibility migration: align the existing legacy products table with the public catalogue.
-- Additive only: retain legacy columns and existing product rows.
do $$
begin
 if not exists(select 1 from information_schema.columns where table_schema='public' and table_name='products' and column_name='slug') then alter table public.products add column slug text; end if;
 if not exists(select 1 from information_schema.columns where table_schema='public' and table_name='products' and column_name='image_url') then alter table public.products add column image_url text; end if;
 if not exists(select 1 from information_schema.columns where table_schema='public' and table_name='products' and column_name='currency_code') then alter table public.products add column currency_code text; end if;
 if not exists(select 1 from information_schema.columns where table_schema='public' and table_name='products' and column_name='is_active') then alter table public.products add column is_active boolean; end if;
 if not exists(select 1 from information_schema.columns where table_schema='public' and table_name='products' and column_name='category_id') then alter table public.products add column category_id uuid; end if;
 if not exists(select 1 from information_schema.columns where table_schema='public' and table_name='products' and column_name='updated_at') then alter table public.products add column updated_at timestamptz not null default now(); end if;
end $$;
create table if not exists public.product_categories(id uuid primary key default gen_random_uuid(),name text not null unique,slug text not null unique,is_active boolean not null default true,created_at timestamptz not null default now());
alter table public.product_categories enable row level security;
insert into public.product_categories(name,slug) select distinct trim(category),regexp_replace(lower(trim(category)),'[^a-z0-9]+','-','g') from public.products where category is not null and trim(category)<>'' on conflict(name) do nothing;
update public.products p set slug=coalesce(nullif(p.slug,''),regexp_replace(lower(trim(p.name)),'[^a-z0-9]+','-','g')||'-'||substr(p.id::text,1,8)),currency_code=coalesce(nullif(p.currency_code,''),trim(p.currency),'USD'),is_active=coalesce(p.is_active,p.active,true),category_id=c.id from public.product_categories c where p.category is not null and trim(p.category)=c.name and (p.slug is null or p.currency_code is null or p.is_active is null or p.category_id is null);
update public.products p set slug=coalesce(p.slug,regexp_replace(lower(trim(p.name)),'[^a-z0-9]+','-','g')||'-'||substr(p.id::text,1,8)),currency_code=coalesce(p.currency_code,trim(p.currency),'USD'),is_active=coalesce(p.is_active,p.active,true) where p.slug is null or p.currency_code is null or p.is_active is null;
alter table public.products alter column slug set not null;
alter table public.products alter column currency_code set default 'USD';
alter table public.products alter column currency_code set not null;
alter table public.products alter column is_active set default true;
alter table public.products alter column is_active set not null;
do $$ begin
 if not exists(select 1 from pg_constraint where conname='products_category_id_fkey') then alter table public.products add constraint products_category_id_fkey foreign key(category_id) references public.product_categories(id) on delete set null; end if;
 if not exists(select 1 from pg_constraint where conname='products_slug_key') then alter table public.products add constraint products_slug_key unique(slug); end if;
end $$;
drop policy if exists product_categories_public_read on public.product_categories;
create policy product_categories_public_read on public.product_categories for select to anon,authenticated using(is_active=true);
drop policy if exists product_categories_admin_manage on public.product_categories;
create policy product_categories_admin_manage on public.product_categories for all to authenticated using(public.current_role()='admin') with check(public.current_role()='admin');
grant select on public.product_categories to anon,authenticated;
grant insert,update,delete on public.product_categories to authenticated;
grant select,insert,update,delete on public.products to authenticated;
notify pgrst,'reload schema';
