-- BLU-12: Breeding ops schema — idempotent for production legacy + fresh installs.
-- Drop legacy empty tables first, reconcile legacy-shaped tanks, then create canonical DDL.

drop table if exists public.hatches cascade;
drop table if exists public.mated_pairs cascade;

do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'tanks'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'tanks' and column_name = 'code'
  ) then
    drop table public.tanks cascade;
  end if;
end $$;

create table if not exists public.tanks (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  capacity_liters numeric,
  location text,
  status text not null default 'active'
    check (status in ('active', 'maintenance', 'retired')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.breeding_pairs (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  tank_id uuid not null references public.tanks (id) on delete restrict,
  species text not null default 'Amphiprion ocellaris',
  male_tag text,
  female_tag text,
  paired_at timestamptz,
  status text not null default 'active'
    check (status in ('active', 'paused', 'retired')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.water_readings (
  id uuid primary key default gen_random_uuid(),
  tank_id uuid not null references public.tanks (id) on delete restrict,
  recorded_at timestamptz not null default now(),
  temperature_c numeric,
  salinity_ppt numeric,
  ph numeric,
  ammonia_ppm numeric,
  nitrite_ppm numeric,
  nitrate_ppm numeric,
  recorded_by text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.batches (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  pair_id uuid not null references public.breeding_pairs (id) on delete restrict,
  tank_id uuid not null references public.tanks (id) on delete restrict,
  spawned_at timestamptz,
  hatched_at timestamptz,
  metamorphosis_at timestamptz,
  weaned_at timestamptz,
  count_spawned integer,
  count_hatched integer,
  count_metamorphosed integer,
  count_weaned integer,
  status text not null default 'spawning'
    check (status in (
      'spawning', 'incubating', 'larval', 'juvenile', 'weaned', 'released', 'lost'
    )),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_water_readings_tank_recorded
  on public.water_readings (tank_id, recorded_at desc);
create index if not exists idx_batches_pair on public.batches (pair_id);
create index if not exists idx_batches_status on public.batches (status);
create index if not exists idx_breeding_pairs_tank on public.breeding_pairs (tank_id);

alter table public.tanks enable row level security;
alter table public.breeding_pairs enable row level security;
alter table public.water_readings enable row level security;
alter table public.batches enable row level security;
