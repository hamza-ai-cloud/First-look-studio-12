-- ============================================================
-- GALLERY STORAGE
-- Public image bucket for admin-uploaded gallery artwork.
-- ============================================================

insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do update
set public = true;

drop policy if exists "Public can view gallery images"
on storage.objects;

create policy "Public can view gallery images"
on storage.objects
for select
using (bucket_id = 'gallery');

drop policy if exists "Service role manages gallery images"
on storage.objects;

create policy "Service role manages gallery images"
on storage.objects
for all
using (bucket_id = 'gallery')
with check (bucket_id = 'gallery');
