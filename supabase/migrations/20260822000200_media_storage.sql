-- ============================================================
-- CMS MEDIA STORAGE
-- ============================================================

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update
set public = true;

drop policy if exists "Public media files are readable"
on storage.objects;

create policy "Public media files are readable"
on storage.objects
for select
to public
using (bucket_id = 'media');

drop policy if exists "Authenticated users can upload media files"
on storage.objects;

create policy "Authenticated users can upload media files"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'media');

drop policy if exists "Authenticated users can update media files"
on storage.objects;

create policy "Authenticated users can update media files"
on storage.objects
for update
to authenticated
using (bucket_id = 'media')
with check (bucket_id = 'media');

drop policy if exists "Authenticated users can delete media files"
on storage.objects;

create policy "Authenticated users can delete media files"
on storage.objects
for delete
to authenticated
using (bucket_id = 'media');
