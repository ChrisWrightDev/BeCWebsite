-- Add featured_image column for Supabase Storage object paths
-- and create public blog-images bucket

-- Add the new column (idempotent)
alter table public.blog_posts add column if not exists featured_image text;

comment on column public.blog_posts.featured_image is 
  'Object path inside the public Supabase Storage bucket "blog-images" (e.g. <slug>/hero.jpg), not a full URL. Primary hero image source; when NULL, the site falls back to featured_image_url.';

-- Create public bucket for blog images (idempotent)
insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;
