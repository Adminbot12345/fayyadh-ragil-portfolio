create extension if not exists pgcrypto;

create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 2 and 120),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text not null default '' check (char_length(description) <= 1000),
  category text not null check (category in ('Video Editing','Motion Design','Reels / Short Form','Cinematic','Social Media')),
  client_name text check (client_name is null or char_length(client_name) <= 120),
  year integer check (year is null or year between 2000 and 2100),
  thumbnail_url text,
  video_url text,
  instagram_url text,
  external_url text,
  is_featured boolean not null default false,
  is_published boolean not null default false,
  sort_order integer not null default 0 check (sort_order between 0 and 100000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.site_settings (
  id uuid primary key,
  full_name text not null default 'Fayyadh Ragil Al Qadri',
  headline text not null default 'Video Editor & Motion Designer',
  hero_supporting_text text not null default 'Cinematic edits, motion design, and short-form stories crafted with rhythm and intent.',
  hero_video_url text not null default '',
  hero_poster_url text not null default '',
  profile_image_url text not null default '',
  bio text not null default 'I create cinematic video edits and motion design for brands, creators, and visual stories.',
  instagram_url text not null default 'https://www.instagram.com/fyyyyydhhhh/',
  whatsapp_number text not null default '081241226094',
  email text not null default 'fayyadhragil@gmail.com',
  primary_cta_label text not null default 'View My Work',
  primary_cta_target text not null default '#work',
  secondary_cta_label text not null default 'Hire Me',
  secondary_cta_target text not null default '#contact',
  updated_at timestamptz not null default now(),
  constraint singleton_site_settings check (id = '00000000-0000-0000-0000-000000000001'::uuid)
);

create table public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 80),
  kind text not null check (kind in ('skill','software')),
  is_visible boolean not null default true,
  sort_order integer not null default 0 check (sort_order between 0 and 100000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger projects_set_updated_at before update on public.projects
for each row execute function public.set_updated_at();
create trigger site_settings_set_updated_at before update on public.site_settings
for each row execute function public.set_updated_at();
create trigger skills_set_updated_at before update on public.skills
for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users au where au.user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

alter table public.admin_users enable row level security;
alter table public.projects enable row level security;
alter table public.site_settings enable row level security;
alter table public.skills enable row level security;

create policy "admin_read_self" on public.admin_users
for select to authenticated using (user_id = auth.uid());

create policy "public_read_published_projects" on public.projects
for select to anon, authenticated using (is_published = true or public.is_admin());
create policy "admin_manage_projects" on public.projects
for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "public_read_settings" on public.site_settings
for select to anon, authenticated using (true);
create policy "admin_manage_settings" on public.site_settings
for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "public_read_visible_skills" on public.skills
for select to anon, authenticated using (is_visible = true or public.is_admin());
create policy "admin_manage_skills" on public.skills
for all to authenticated using (public.is_admin()) with check (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('portfolio-images', 'portfolio-images', true, 10485760, array['image/jpeg','image/png','image/webp']),
  ('portfolio-videos', 'portfolio-videos', true, 262144000, array['video/mp4','video/webm','video/quicktime'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "public_read_portfolio_media" on storage.objects
for select to anon, authenticated using (bucket_id in ('portfolio-images','portfolio-videos'));
create policy "admin_insert_portfolio_media" on storage.objects
for insert to authenticated with check (bucket_id in ('portfolio-images','portfolio-videos') and public.is_admin());
create policy "admin_update_portfolio_media" on storage.objects
for update to authenticated using (bucket_id in ('portfolio-images','portfolio-videos') and public.is_admin())
with check (bucket_id in ('portfolio-images','portfolio-videos') and public.is_admin());
create policy "admin_delete_portfolio_media" on storage.objects
for delete to authenticated using (bucket_id in ('portfolio-images','portfolio-videos') and public.is_admin());
