-- ============================================================
-- PORTFOLIO
-- Independent from gallery.
-- ============================================================

create table if not exists public.portfolio (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_url text not null,
  category text not null default 'Weddings',
  aspect_ratio text default 'landscape',
  description text,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists portfolio_active_sort_idx
  on public.portfolio (is_active, sort_order);

create index if not exists portfolio_featured_idx
  on public.portfolio (is_featured, is_active);

create or replace function public.set_portfolio_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists portfolio_updated_at on public.portfolio;

create trigger portfolio_updated_at
before update on public.portfolio
for each row
execute function public.set_portfolio_updated_at();

-- ============================================================
-- STORAGE
-- ============================================================

insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do update
set public = true;

drop policy if exists "Public portfolio images are readable"
on storage.objects;

create policy "Public portfolio images are readable"
on storage.objects
for select
to public
using (bucket_id = 'portfolio');

drop policy if exists "Authenticated users can upload portfolio images"
on storage.objects;

create policy "Authenticated users can upload portfolio images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'portfolio');

drop policy if exists "Authenticated users can update portfolio images"
on storage.objects;

create policy "Authenticated users can update portfolio images"
on storage.objects
for update
to authenticated
using (bucket_id = 'portfolio')
with check (bucket_id = 'portfolio');

drop policy if exists "Authenticated users can delete portfolio images"
on storage.objects;

create policy "Authenticated users can delete portfolio images"
on storage.objects
for delete
to authenticated
using (bucket_id = 'portfolio');
