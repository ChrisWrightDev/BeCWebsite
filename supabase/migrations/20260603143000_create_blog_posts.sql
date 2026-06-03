-- Blog publishing support for Blue-Eyed Clowns.
-- Public visitors can read published posts only. Drafts remain private.

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) > 0),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  excerpt text,
  content text not null default '',
  category text not null default 'Hatchery Notes',
  tags text[] not null default '{}',
  featured_image_url text,
  featured_image_alt text,
  author_name text not null default 'Blue-Eyed Clowns',
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  is_featured boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint published_posts_have_a_date check (status <> 'published' or published_at is not null)
);

create index if not exists blog_posts_public_listing_idx
  on public.blog_posts (is_featured desc, published_at desc)
  where status = 'published';

create index if not exists blog_posts_slug_idx
  on public.blog_posts (slug);

alter table public.blog_posts enable row level security;

revoke all on table public.blog_posts from anon, authenticated;
grant select on table public.blog_posts to anon, authenticated;
grant select, insert, update, delete on table public.blog_posts to service_role;

drop policy if exists "Public can read published blog posts" on public.blog_posts;
create policy "Public can read published blog posts"
  on public.blog_posts
  for select
  to anon, authenticated
  using (status = 'published' and published_at <= now());

create or replace function public.set_blog_posts_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists blog_posts_set_updated_at on public.blog_posts;
create trigger blog_posts_set_updated_at
  before update on public.blog_posts
  for each row
  execute function public.set_blog_posts_updated_at();

insert into public.blog_posts (
  title,
  slug,
  excerpt,
  content,
  category,
  tags,
  featured_image_url,
  featured_image_alt,
  author_name,
  status,
  is_featured,
  published_at
)
values (
  'Welcome to the Blue-Eyed Clowns Hatchery Journal',
  'welcome-to-the-blue-eyed-clowns-hatchery-journal',
  'Follow our captive-bred clownfish journey: hatchery notes, care guides, grow-out updates, and reef-safe advice from our systems to yours.',
  'Welcome to the Blue-Eyed Clowns blog. This space will collect our best hatchery notes, grow-out updates, care guides, and behind-the-scenes looks at how we raise healthy captive-bred clownfish. Future posts will cover feeding, acclimation, morph development, shipping preparation, and what we are learning inside the hatchery. If you keep reef aquariums or simply love clownfish, this will be your organized home base for practical, fish-first information.',
  'Hatchery Notes',
  array['hatchery', 'clownfish', 'aquaculture'],
  null,
  null,
  'Blue-Eyed Clowns',
  'published',
  true,
  now()
)
on conflict (slug) do nothing;
