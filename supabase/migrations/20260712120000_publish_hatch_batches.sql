-- Make hatch batches with public titles visible on the hatchery journal.
-- Safe to re-run; only flips rows that already have customer-facing copy.

update public.hatch_batches
set
  public_visible = true,
  published_at = coalesce(published_at, now()),
  updated_at = now()
where public_visible is distinct from true
  and public_title is not null
  and length(trim(public_title)) > 0;

-- Allow anonymous reads of public hatch rows (blog/API may also use service role).
do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'hatch_batches'
      and policyname = 'Public can read visible hatch batches'
  ) then
    create policy "Public can read visible hatch batches"
      on public.hatch_batches
      for select
      to anon, authenticated
      using (public_visible = true);
  end if;
exception
  when undefined_table then
    null;
  when undefined_object then
    null;
end $$;
