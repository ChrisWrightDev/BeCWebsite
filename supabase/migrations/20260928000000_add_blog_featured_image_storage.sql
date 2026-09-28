-- Add featured_image column for Supabase Storage object paths
-- and create public blog-images bucket

-- Add the new column
alter table public.blog_posts add column featured_image text;

-- Create public bucket for blog images (if it doesn't exist)
-- Note: this SQL only creates the record; bucket policies must be configured in Supabase dashboard
insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;
