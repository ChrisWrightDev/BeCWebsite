-- Run this in Supabase SQL Editor to create tables for orders and work orders.
-- Requires existing clownfish table (id, name, price_cents, etc.).

-- Orders (one per checkout)
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  stripe_payment_intent_id text unique,
  customer_email text not null,
  customer_name text,
  shipping_address_line1 text,
  shipping_address_line2 text,
  shipping_city text,
  shipping_state text,
  shipping_postal_code text,
  shipping_country text default 'US',
  total_cents integer not null check (total_cents > 0),
  status text not null default 'pending' check (status in ('pending', 'paid', 'processing', 'shipped', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Order line items
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  clownfish_id uuid references public.clownfish (id) on delete set null,
  product_name text not null,
  quantity integer not null check (quantity > 0),
  price_cents integer not null check (price_cents >= 0),
  created_at timestamptz not null default now()
);

-- Work orders: one per order, everything needed to fulfill (pick, pack, ship)
create table if not exists public.work_orders (
  id uuid primary key default gen_random_uuid(),
  work_order_number text not null unique,
  order_id uuid not null references public.orders (id) on delete cascade,
  customer_name text,
  customer_email text not null,
  shipping_address_line1 text,
  shipping_address_line2 text,
  shipping_city text,
  shipping_state text,
  shipping_postal_code text,
  shipping_country text default 'US',
  line_items jsonb not null default '[]'::jsonb,
  total_cents integer not null check (total_cents >= 0),
  status text not null default 'pending' check (status in ('pending', 'picking', 'packing', 'shipped', 'done')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes for common lookups
create index if not exists idx_order_items_order_id on public.order_items (order_id);
create index if not exists idx_work_orders_order_id on public.work_orders (order_id);
create index if not exists idx_work_orders_number on public.work_orders (work_order_number);
create index if not exists idx_work_orders_created_at on public.work_orders (created_at desc);
create index if not exists idx_work_orders_status on public.work_orders (status);
create index if not exists idx_orders_stripe on public.orders (stripe_payment_intent_id);
create index if not exists idx_orders_created_at on public.orders (created_at desc);

-- RLS: allow server (service role) to do everything; optionally allow anon to read their own order by email (skip for now)
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.work_orders enable row level security;

-- Policy: service role bypasses RLS. Use NUXT_SUPABASE_SERVICE_ROLE_KEY in server APIs.
-- No policies needed for anon if only server writes; create policies if you want client reads later.
