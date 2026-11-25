-- ADICo Global commerce foundation
-- Additive schema. Does not alter existing profiles, account_role, or current_role().
-- All privileged writes must be performed by trusted server-side workflows.
create table if not exists public.retailers (
 id uuid primary key default gen_random_uuid(),
 profile_id uuid not null unique references public.profiles(id) on delete restrict,
 country_code text not null check (country_code in ('LR','NO')),
 business_type text not null check (business_type in ('individual','retail_shop','online_retailer','wholesaler','distributor')),
 business_name text,
 approval_status text not null default 'pending' check (approval_status in ('pending','approved','suspended','rejected')),
 agreement_accepted_at timestamptz, approved_at timestamptz, created_at timestamptz not null default now()
);
create table if not exists public.product_categories (
 id uuid primary key default gen_random_uuid(), name text not null unique, slug text not null unique,
 is_active boolean not null default true, created_at timestamptz not null default now()
);
create table if not exists public.products (
 id uuid primary key default gen_random_uuid(), category_id uuid references public.product_categories(id) on delete set null,
 sku text not null unique, name text not null, slug text not null unique, description text, image_url text,
 currency_code text not null default 'USD' check (currency_code in ('USD','LRD','NOK')),
 retail_price numeric(12,2) not null check (retail_price >= 0), is_active boolean not null default false,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.country_product_availability (
 product_id uuid not null references public.products(id) on delete cascade,
 country_code text not null check (country_code in ('LR','NO')), is_available boolean not null default false,
 primary key(product_id,country_code)
);
create table if not exists public.warehouses (
 id uuid primary key default gen_random_uuid(), country_code text not null check (country_code in ('LR','NO')),
 name text not null, is_active boolean not null default false, created_at timestamptz not null default now()
);
create table if not exists public.inventory_movements (
 id uuid primary key default gen_random_uuid(), product_id uuid not null references public.products(id) on delete restrict,
 warehouse_id uuid not null references public.warehouses(id) on delete restrict,
 retailer_id uuid references public.retailers(id) on delete restrict,
 movement_type text not null check (movement_type in ('opening','received','consigned_out','sold','returned','adjustment')),
 quantity integer not null check (quantity > 0), reference text, notes text,
 created_by uuid references public.profiles(id) on delete set null, created_at timestamptz not null default now()
);
create table if not exists public.consignments (
 id uuid primary key default gen_random_uuid(), retailer_id uuid not null references public.retailers(id) on delete restrict,
 warehouse_id uuid not null references public.warehouses(id) on delete restrict,
 status text not null default 'draft' check (status in ('draft','issued','partially_settled','settled','recalled','disputed')),
 issued_at timestamptz, due_at timestamptz, notes text, created_at timestamptz not null default now()
);
create table if not exists public.consignment_items (
 id uuid primary key default gen_random_uuid(), consignment_id uuid not null references public.consignments(id) on delete cascade,
 product_id uuid not null references public.products(id) on delete restrict,
 quantity_issued integer not null check (quantity_issued > 0), quantity_sold integer not null default 0 check (quantity_sold >= 0),
 quantity_returned integer not null default 0 check (quantity_returned >= 0), unit_cost numeric(12,2) not null check (unit_cost >= 0),
 unique(consignment_id,product_id), check(quantity_sold + quantity_returned <= quantity_issued)
);
create table if not exists public.customer_orders (
 id uuid primary key default gen_random_uuid(), order_number text not null unique,
 customer_profile_id uuid references public.profiles(id) on delete set null,
 retailer_id uuid references public.retailers(id) on delete set null,
 country_code text not null check (country_code in ('LR','NO')),
 currency_code text not null check (currency_code in ('USD','LRD','NOK')),
 status text not null default 'pending' check (status in ('pending','confirmed','processing','fulfilled','cancelled','refunded','disputed')),
 payment_status text not null default 'unpaid' check (payment_status in ('unpaid','pending','paid','failed','refunded','partially_refunded')),
 subtotal numeric(12,2) not null default 0 check(subtotal >= 0), delivery_fee numeric(12,2) not null default 0 check(delivery_fee >= 0),
 total numeric(12,2) not null default 0 check(total >= 0), customer_name text not null, customer_email text not null,
 delivery_address text not null, created_at timestamptz not null default now()
);
create table if not exists public.customer_order_items (
 id uuid primary key default gen_random_uuid(), order_id uuid not null references public.customer_orders(id) on delete cascade,
 product_id uuid not null references public.products(id) on delete restrict, quantity integer not null check(quantity > 0),
 unit_price numeric(12,2) not null check(unit_price >= 0), line_total numeric(12,2) not null check(line_total >= 0)
);
create table if not exists public.retailer_commissions (
 id uuid primary key default gen_random_uuid(), retailer_id uuid not null references public.retailers(id) on delete restrict,
 order_id uuid not null references public.customer_orders(id) on delete restrict,
 eligible_sales_amount numeric(12,2) not null check(eligible_sales_amount >= 0),
 commission_rate numeric(5,4) not null default 0.1000 check(commission_rate = 0.1000),
 commission_amount numeric(12,2) not null check(commission_amount >= 0),
 status text not null default 'pending' check(status in ('estimated','pending','verified','approved','payable','paid','reversed','disputed')),
 created_at timestamptz not null default now(), unique(retailer_id,order_id)
);
alter table public.retailers enable row level security;
alter table public.product_categories enable row level security;
alter table public.products enable row level security;
alter table public.country_product_availability enable row level security;
alter table public.warehouses enable row level security;
alter table public.inventory_movements enable row level security;
alter table public.consignments enable row level security;
alter table public.consignment_items enable row level security;
alter table public.customer_orders enable row level security;
alter table public.customer_order_items enable row level security;
alter table public.retailer_commissions enable row level security;
drop policy if exists products_public_catalogue_read on public.products;
create policy products_public_catalogue_read on public.products for select to anon,authenticated using(is_active=true);
drop policy if exists categories_public_read on public.product_categories;
create policy categories_public_read on public.product_categories for select to anon,authenticated using(is_active=true);
drop policy if exists product_country_public_read on public.country_product_availability;
create policy product_country_public_read on public.country_product_availability for select to anon,authenticated using(is_available=true);
drop policy if exists retailers_self_read on public.retailers;
create policy retailers_self_read on public.retailers for select to authenticated using(profile_id=auth.uid() or public.current_role()='admin');
drop policy if exists warehouses_admin_read on public.warehouses;
create policy warehouses_admin_read on public.warehouses for select to authenticated using(public.current_role()='admin');
drop policy if exists movements_admin_read on public.inventory_movements;
create policy movements_admin_read on public.inventory_movements for select to authenticated using(public.current_role()='admin');
drop policy if exists consignments_admin_read on public.consignments;
create policy consignments_admin_read on public.consignments for select to authenticated using(public.current_role()='admin');
drop policy if exists consignment_items_admin_read on public.consignment_items;
create policy consignment_items_admin_read on public.consignment_items for select to authenticated using(public.current_role()='admin');
drop policy if exists orders_admin_read on public.customer_orders;
create policy orders_admin_read on public.customer_orders for select to authenticated using(public.current_role()='admin');
drop policy if exists order_items_admin_read on public.customer_order_items;
create policy order_items_admin_read on public.customer_order_items for select to authenticated using(public.current_role()='admin');
drop policy if exists commissions_admin_read on public.retailer_commissions;
create policy commissions_admin_read on public.retailer_commissions for select to authenticated using(public.current_role()='admin');
revoke all on public.retailers,public.warehouses,public.inventory_movements,public.consignments,public.consignment_items,public.customer_orders,public.customer_order_items,public.retailer_commissions from anon,authenticated;
grant select on public.products,public.product_categories,public.country_product_availability to anon,authenticated;
grant select on public.retailers,public.warehouses,public.inventory_movements,public.consignments,public.consignment_items,public.customer_orders,public.customer_order_items,public.retailer_commissions to authenticated;
