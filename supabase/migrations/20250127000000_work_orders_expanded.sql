-- Work orders: one per order, with everything needed to fulfill (pick, pack, ship).
-- Run after schema-orders.sql (orders + order_items must exist).
-- Replaces the minimal work_orders table with the expanded one.

drop table if exists public.work_orders cascade;

create table public.work_orders (
  id uuid primary key default gen_random_uuid(),
  work_order_number text not null unique,
  order_id uuid not null references public.orders (id) on delete cascade,

  -- Customer
  customer_name text,
  customer_email text not null,

  -- Shipping address (full address for packing slip / label)
  shipping_address_line1 text,
  shipping_address_line2 text,
  shipping_city text,
  shipping_state text,
  shipping_postal_code text,
  shipping_country text default 'US',

  -- What to pick: array of { product_name, quantity, price_cents }
  line_items jsonb not null default '[]'::jsonb,

  -- Totals and status
  total_cents integer not null check (total_cents >= 0),
  status text not null default 'pending' check (status in ('pending', 'picking', 'packing', 'shipped', 'done')),
  notes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_work_orders_order_id on public.work_orders (order_id);
create index idx_work_orders_number on public.work_orders (work_order_number);
create index idx_work_orders_created_at on public.work_orders (created_at desc);
create index idx_work_orders_status on public.work_orders (status);

alter table public.work_orders enable row level security;
