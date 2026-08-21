-- ============================================================
-- SERVICES + GALLERY TABLES
-- Existing admin/API/CMS structure ke mutabiq
-- Hero/Home section data ko touch nahi karta.
-- ============================================================

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text,
  description text,
  short_description text,
  image_url text,
  category text,
  price numeric,
  price_text text,
  duration text,
  features jsonb not null default '[]'::jsonb,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

create index if not exists services_sort_order_idx
  on public.services(sort_order);

create index if not exists services_active_idx
  on public.services(is_active);

create index if not exists services_featured_idx
  on public.services(is_featured);

create table if not exists public.gallery (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_url text not null,
  category text not null,
  aspect_ratio text default 'landscape',
  description text,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

create index if not exists gallery_sort_order_idx
  on public.gallery(sort_order);

create index if not exists gallery_active_idx
  on public.gallery(is_active);

create index if not exists gallery_featured_idx
  on public.gallery(is_featured);

-- Keep these tables protected.
alter table public.services enable row level security;
alter table public.gallery enable row level security;

-- Public website reads are allowed only for active records.
drop policy if exists "Public can view active services"
  on public.services;

create policy "Public can view active services"
  on public.services
  for select
  using (is_active = true);

drop policy if exists "Public can view active gallery"
  on public.gallery;

create policy "Public can view active gallery"
  on public.gallery
  for select
  using (is_active = true);

-- Admin/server code uses service-role and therefore bypasses RLS.
