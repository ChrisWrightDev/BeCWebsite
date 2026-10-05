-- Release-list unsubscribe feedback.
-- Apply this file in Supabase before deploying the matching website changes.
-- This migration does not delete subscriber rows and does not weaken RLS.
-- Admins stay select-only. The public unsubscribe route updates rows with the service role.

alter table public.subscribers
  add column if not exists unsubscribe_reason text;

alter table public.subscribers
  add column if not exists unsubscribe_feedback text;

alter table public.subscribers
  drop constraint if exists subscribers_unsubscribe_reason_check;

alter table public.subscribers
  add constraint subscribers_unsubscribe_reason_check
  check (
    unsubscribe_reason is null
    or unsubscribe_reason in (
      'Too many emails',
      'Not interested right now',
      'Never signed up',
      'Other'
    )
  );

alter table public.subscribers
  drop constraint if exists subscribers_unsubscribe_feedback_length_check;

alter table public.subscribers
  add constraint subscribers_unsubscribe_feedback_length_check
  check (
    unsubscribe_feedback is null
    or char_length(unsubscribe_feedback) <= 1000
  );

comment on column public.subscribers.unsubscribe_reason is
  'Why the person left the release list. Null while subscribed. The row is kept after unsubscribe.';

comment on column public.subscribers.unsubscribe_feedback is
  'Optional free-text note from the unsubscribe form. Null when they leave it blank.';

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
