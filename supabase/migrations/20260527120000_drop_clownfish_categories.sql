-- Remove clownfish_categories and category-related columns from clownfish.
-- Safe to run if columns/table were never created (checks information_schema first).

-- Drop foreign key from clownfish.category_id -> clownfish_categories (if present)
do $$
declare
  fk_name text;
begin
  select tc.constraint_name into fk_name
  from information_schema.table_constraints tc
  join information_schema.key_column_usage kcu
    on tc.constraint_name = kcu.constraint_name
    and tc.table_schema = kcu.table_schema
  where tc.table_schema = 'public'
    and tc.table_name = 'clownfish'
    and tc.constraint_type = 'FOREIGN KEY'
    and kcu.column_name = 'category_id'
  limit 1;

  if fk_name is not null then
    execute format('alter table public.clownfish drop constraint %I', fk_name);
  end if;
end $$;

-- Drop indexes on category columns (if any)
drop index if exists public.idx_clownfish_category_id;
drop index if exists public.idx_clownfish_category_name;

-- Remove category columns from clownfish
alter table public.clownfish drop column if exists category_id;
alter table public.clownfish drop column if exists category_name;

-- Drop the categories lookup table
drop table if exists public.clownfish_categories cascade;
