-- Email capture, inquiries, customer identity, and order confirmation tracking.
-- Apply this file before deploying the matching website changes.
-- Does not remove RLS. Service-role server routes write; admins read through public.is_admin.

-- ---------------------------------------------------------------------------
-- Customers: one row per email address.
-- The previous unique (name, email) treated the same inbox as a new customer
-- whenever the name differed (and NULL names never collided). Email is the
-- identity. Existing non-empty name, phone, notes, and unrecognized sources
-- are kept when rows are collapsed.
-- ---------------------------------------------------------------------------

alter table public.customers drop constraint if exists customers_name_email_key;

update public.customers
set email = null
where email is not null and btrim(email) = '';

do $$
declare
  rec record;
  keeper_id uuid;
begin
  for rec in
    select lower(btrim(email)) as email_key
    from public.customers
    where email is not null and btrim(email) <> ''
    group by lower(btrim(email))
    having count(*) > 1
  loop
    select id into keeper_id
    from public.customers
    where lower(btrim(email)) = rec.email_key
    order by created_at asc, id asc
    limit 1;

    update public.customers keeper
    set
      name = coalesce(nullif(btrim(keeper.name), ''), extras.name),
      phone = coalesce(nullif(btrim(keeper.phone), ''), extras.phone),
      notes = coalesce(nullif(btrim(keeper.notes), ''), extras.notes)
    from (
      select
        (array_agg(name order by created_at desc) filter (where nullif(btrim(name), '') is not null))[1] as name,
        (array_agg(phone order by created_at desc) filter (where nullif(btrim(phone), '') is not null))[1] as phone,
        (array_agg(notes order by created_at desc) filter (where nullif(btrim(notes), '') is not null))[1] as notes
      from public.customers
      where lower(btrim(email)) = rec.email_key
        and id <> keeper_id
    ) extras
    where keeper.id = keeper_id;

    update public.bank_transactions
    set customer_id = keeper_id
    where customer_id in (
      select id from public.customers
      where lower(btrim(email)) = rec.email_key
        and id <> keeper_id
    );

    delete from public.customers
    where lower(btrim(email)) = rec.email_key
      and id <> keeper_id;
  end loop;
end $$;

update public.customers
set email = lower(btrim(email))
where email is not null
  and email is distinct from lower(btrim(email));

create unique index if not exists customers_email_lower_key
  on public.customers (lower(email));

comment on index public.customers_email_lower_key is
  'One customer per email address, case-insensitive. Replaces unique (name, email).';

alter table public.customers enable row level security;

drop policy if exists "Admins can select customers" on public.customers;
create policy "Admins can select customers"
  on public.customers
  for select
  to authenticated
  using (public.is_admin(auth.uid()));

drop policy if exists "Admins can update customers" on public.customers;
create policy "Admins can update customers"
  on public.customers
  for update
  to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- ---------------------------------------------------------------------------
-- Orders: link the buyer and remember when the confirmation email went out.
-- ---------------------------------------------------------------------------

alter table public.orders
  add column if not exists customer_id uuid references public.customers (id) on delete set null;

alter table public.orders
  add column if not exists confirmation_sent_at timestamptz;

create index if not exists orders_customer_id_idx on public.orders (customer_id);

-- One fulfillment work order per paid order. Concurrent webhook/browser writes
-- collide here instead of inserting a second work order.
create unique index if not exists work_orders_one_per_order
  on public.work_orders (order_id);

-- Insert line items once, even if the webhook and the browser complete call overlap.
create or replace function public.insert_order_items_if_absent(p_order_id uuid, p_items jsonb)
returns integer
language plpgsql
security invoker
set search_path = public
as $$
declare
  inserted_count integer := 0;
begin
  perform pg_advisory_xact_lock(hashtext(p_order_id::text));

  if exists (select 1 from public.order_items where order_id = p_order_id) then
    return 0;
  end if;

  insert into public.order_items (order_id, clownfish_id, product_name, quantity, price_cents)
  select
    p_order_id,
    case
      when item->>'clownfish_id' is null or btrim(item->>'clownfish_id') = '' then null
      else (item->>'clownfish_id')::uuid
    end,
    item->>'product_name',
    (item->>'quantity')::integer,
    (item->>'price_cents')::integer
  from jsonb_array_elements(p_items) as item;

  get diagnostics inserted_count = row_count;
  return inserted_count;
end;
$$;

revoke all on function public.insert_order_items_if_absent(uuid, jsonb) from public, anon, authenticated;
grant execute on function public.insert_order_items_if_absent(uuid, jsonb) to service_role;

-- ---------------------------------------------------------------------------
-- Release list
-- ---------------------------------------------------------------------------

create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  name text,
  source text not null default 'website',
  status text not null default 'subscribed' check (status in ('subscribed', 'unsubscribed')),
  created_at timestamptz not null default now(),
  unsubscribed_at timestamptz,
  unsubscribe_token text not null unique
);

create unique index if not exists subscribers_email_lower_key
  on public.subscribers (lower(email));

create index if not exists subscribers_status_idx
  on public.subscribers (status);

alter table public.subscribers enable row level security;

revoke all on table public.subscribers from anon, authenticated;
grant select on table public.subscribers to authenticated;
grant select, insert, update, delete on table public.subscribers to service_role;

drop policy if exists "Admins can select subscribers" on public.subscribers;
create policy "Admins can select subscribers"
  on public.subscribers
  for select
  to authenticated
  using (public.is_admin(auth.uid()));

-- ---------------------------------------------------------------------------
-- Contact, wholesale, local pickup, and product questions
-- ---------------------------------------------------------------------------

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('contact', 'wholesale', 'local_pickup', 'product_question')),
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  related_product_slug text,
  related_pair_slug text,
  status text not null default 'new' check (status in ('new', 'replied', 'closed')),
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists inquiries_created_at_idx
  on public.inquiries (created_at desc);

create index if not exists inquiries_status_idx
  on public.inquiries (status);

alter table public.inquiries enable row level security;

revoke all on table public.inquiries from anon, authenticated;
grant select, update on table public.inquiries to authenticated;
grant select, insert, update, delete on table public.inquiries to service_role;

drop policy if exists "Admins can select inquiries" on public.inquiries;
create policy "Admins can select inquiries"
  on public.inquiries
  for select
  to authenticated
  using (public.is_admin(auth.uid()));

drop policy if exists "Admins can update inquiries" on public.inquiries;
create policy "Admins can update inquiries"
  on public.inquiries
  for update
  to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

create or replace function public.set_row_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists inquiries_set_updated_at on public.inquiries;
create trigger inquiries_set_updated_at
  before update on public.inquiries
  for each row
  execute function public.set_row_updated_at();
